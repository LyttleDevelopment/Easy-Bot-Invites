import { Invite } from 'discord.js';
import { onGuildInviteDelete } from '../actions/onGuildInviteDelete';

// Emitted when the client becomes ready to start working.
async function inviteDelete(invite: Invite): Promise<void> {
  // Fire actions
  await onGuildInviteDelete(invite);
}

export default inviteDelete;
