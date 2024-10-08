import {
  Guild as DiscordGuild,
  GuildMember,
  Invite,
  TextChannel,
} from 'discord.js';
import {
  deleteMember,
  deleteMembers,
  findEveryMember,
  findSingleGuild,
} from '../../database/handlers';
import client from '../../main';
import { findSingleInvite } from '../../database/handlers/invite';

export async function cleanupInviteMembers(invite: Invite): Promise<void> {
  return cleanupInviteMembersById(invite.guild.id, invite.code);
}

export async function cleanupInviteMembersById(
  guildId: string,
  inviteId: string,
): Promise<void> {
  const dbInvite = await findSingleInvite(guildId, inviteId);
  if (!dbInvite || dbInvite.type != 'pug__raid') return;

  const dbMembers = await findEveryMember(guildId, {
    invite_id: inviteId,
    is_inviter: false,
  });

  const guild = client.guilds.cache.get(guildId);
  const discordMembers = dbMembers.map((dbMember) =>
    guild.members.cache.get(dbMember.user_id.toString()),
  );

  for (const member of discordMembers) {
    try {
      await kickPlayer(member, 'Temporary invite expired');
    } catch (e) {}
  }
}

export async function cleanupMembers(guild: DiscordGuild) {
  const dbMembers = await findEveryMember(guild.id, {
    is_inviter: false,
    kick_at: {
      lte: new Date(),
    },
  });

  const discordDBMembers = dbMembers.map((dbMember) =>
    guild.members.cache.get(dbMember.user_id.toString()),
  );

  for (const member of discordDBMembers) {
    await kickPlayer(member, 'Pug raid invite expired');
  }

  const dbMembersNoLongerInGuild = dbMembers.filter(
    (dbMember) =>
      guild.members.cache.get(dbMember.user_id.toString()) === undefined,
  );
  await deleteMembers(
    guild.id,
    dbMembersNoLongerInGuild.map((dbMember) => dbMember.user_id.toString()),
  );
}

export async function cleanupAllMembers() {
  const guilds: DiscordGuild[] = client.guilds.cache.map((guild) => guild);

  for (const guild of guilds) {
    await cleanupMembers(guild);
  }
}

export async function kickPlayer(member: GuildMember, reason: string) {
  try {
    await member.kick(reason);
    await deleteMember(member.guild.id, member.id);

    const db_guild = await findSingleGuild(member.guild.id);

    // Log to the admin channel
    const adminChannel = member.guild.channels.cache.get(
      db_guild.announce_channel_id.toString(),
    ) as TextChannel;
    if (!adminChannel) return;
    await adminChannel.send(`Kicked ${member} for ${reason}`);
  } catch (e) {}
}
