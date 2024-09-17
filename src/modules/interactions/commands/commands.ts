import { setupCommandData } from '../../commands/setup/setup-command';
import { inviteCommandData } from '../../commands/invite/invite-command';

/**
 * All registered commands DATA
 * !! Not typed, so we can detect the command name !!
 */
export const commands = [setupCommandData, inviteCommandData] as const;
