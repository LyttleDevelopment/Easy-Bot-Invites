import { setupCommand } from '../../commands/setup/setup-command';
import { CommandRoutes } from './command-types';
import { inviteCommand } from '../../commands/invite/invite-command';

/**
 * All routes for button presses
 * customId: Function
 */
export const commandRoutes: CommandRoutes = {
  invite_setup: setupCommand,
  invite: inviteCommand,
};
