import { Invite } from 'discord.js';
import { findEveryMember } from '../../database/handlers';
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
    await member.kick('Temporary invite expired');
  }
}
