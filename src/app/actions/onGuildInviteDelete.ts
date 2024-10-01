import { Invite } from 'discord.js';
import { executor } from '../../utils';
import { updateInvitesCache } from '../../modules/invite/check-invite';
import { cleanupInviteMembers } from '../../modules/invite/cleanup-invite-members';

// The execute function
export async function onGuildInviteDelete(invite: Invite): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(cleanupInviteMembers, invite),
    executor(updateInvitesCache, invite.guild.id),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
