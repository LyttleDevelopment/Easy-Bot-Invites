import { setupCommand } from '../../commands/setup-command';
import { CommandRoutes } from './command-types';

/**
 * All routes for button presses
 * customId: Function
 */
export const commandRoutes: CommandRoutes = {
  invite_setup: setupCommand,
};
