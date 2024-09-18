import { Invite } from 'discord.js';
import { onGuildInviteCreate } from '../actions/onGuildInviteCreate';

// Emitted when the client becomes ready to start working.
async function inviteCreate(invite: Invite): Promise<void> {
  // Fire actions
  await onGuildInviteCreate(invite);
}

export default inviteCreate;
