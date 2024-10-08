// Type for storing invite cache
import { Collection, Invite } from 'discord.js';
import client from '../../main';
import { GuildMember } from '../../types';
import { deleteInvites, findEveryInvite } from '../../database/handlers/invite';
import { cleanupInviteMembersById } from './cleanup-invite-members';

type InviteCache = Collection<string, InviteCacheItem>;
type InviteCacheItem = Collection<string, InviteCacheInvite>;

interface InviteCacheInvite {
  code: string;
  uses: number;
}

// Cache to store invites for each guild
const invitesCache: InviteCache = new Collection();

export async function initInviteCache() {
  await deleteUnknownInvites();

  // Initialize invite cache for all guilds the bot is in
  const guilds = client.guilds.cache;
  for (const guild of guilds.values()) {
    await updateInvitesCache(guild.id, true);
  }
}

export async function deleteUnknownInvites() {
  const db_invites = await findEveryInvite();

  const invitePromises = client.guilds.cache.map(async (guild) => {
    try {
      const invites = await guild.invites.fetch();
      return Array.from(invites.values()); // Convert Map to array
    } catch (error) {
      console.error(`Error fetching invites for guild: ${guild.name}`, error);
      return []; // Return an empty array if there was an error (e.g., missing permissions)
    }
  });

  // Wait for all guild invite fetches to complete
  const allInvites = await Promise.all(invitePromises);

  // Flatten the array of arrays into a single array
  const discordInvites = allInvites.flat();

  const unknownInvites = discordInvites.filter((invite) => {
    return !db_invites.some((db_invite) => db_invite.invite_id === invite.code);
  });

  for (const invite of unknownInvites) {
    if (!invite.inviter.bot) {
      await invite.inviter.send(
        'Your invite has been deleted because it was not created using this bot.\n' +
          invite.url,
      );
    }
    await invite.delete('Unauthorized invite');
    // Remove the invite from the cache
    const guildInvites = invitesCache.get(invite.guild.id);
    if (guildInvites) {
      guildInvites.delete(invite.code);
    }
  }
}

export async function updateKnownInvites() {
  if (invitesCache.size === 0) {
    await initInviteCache();
  }
  // Get all invite codes for all guilds
  const invites: string[] = invitesCache
    .map((guildInvites) => {
      return guildInvites.map((invite) => invite.code);
    })
    .flat();

  // Delete all non-existent invites
  const db_invites = await findEveryInvite();
  const unknownDbInvites = db_invites.filter(
    (db_invite) => !invites.includes(db_invite.invite_id),
  );

  for (const db_invite of unknownDbInvites) {
    await cleanupInviteMembersById(
      db_invite.guild_id.toString(),
      db_invite.invite_id,
    );
  }
  await deleteInvites(unknownDbInvites.map((invite) => invite.invite_id));
  await deleteUnknownInvites();
}

// Function to update invite cache for a guild
export async function updateInvitesCache(
  guildId: string,
  init = false,
  invites: Collection<string, Invite> | null = null,
) {
  try {
    if (!invites) {
      invites = await client.guilds.cache.get(guildId).invites.fetch();
    }
    const inviteMap = new Collection<string, InviteCacheInvite>();

    invites.forEach((invite) => {
      inviteMap.set(invite.code, {
        code: invite.code,
        uses: invite.uses || 0,
      });
    });

    invitesCache.set(guildId, inviteMap);
    if (!init) {
      await updateKnownInvites();
    }
  } catch (error) {
    console.error(`Error fetching invites for guild ${guildId}:`, error);
  }
}

export async function checkInvite(
  guildMember: GuildMember,
): Promise<Invite | null> {
  const cachedInvites = invitesCache.get(guildMember.guildId);
  if (!cachedInvites) return;

  const guild = client.guilds.cache.get(guildMember.guildId);

  try {
    const newInvites = await guild.invites.fetch();

    const usedInvite = newInvites.find((inv) => {
      const cachedInvite = cachedInvites.get(inv.code);
      return cachedInvite && inv.uses! > cachedInvite.uses;
    });

    // Update cache after a member joins
    await updateInvitesCache(guildMember.guildId, false, newInvites);

    if (usedInvite) {
      return usedInvite;
    }
  } catch (error) {
    console.error('Error fetching invites after member join:', error);
  }
  return null;
}
