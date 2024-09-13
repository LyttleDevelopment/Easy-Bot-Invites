import {
  setupCommand1Yes,
  setupCommand2Yes,
  setupCommand3Yes,
  setupCommandNo,
} from '../../commands/setup-command';
import { ButtonInteraction } from 'discord.js';
import { GuildMember } from '../../../types';

/**
 * All routes for button presses
 * customId: Function
 */
export const buttonRoutes: ButtonRoutes = {
  'setup-command_1_yes': setupCommand1Yes,
  'setup-command_2_yes': setupCommand2Yes,
  'setup-command_3_yes': setupCommand3Yes,
  'setup-command_3_yes1': setupCommand3Yes,
  'setup-command_3_yes2': setupCommand3Yes,
  'setup-command_no': setupCommandNo,
};

/**
 * All routes/functions for button presses interface
 */
export interface ButtonRoutes {
  [key: string]: (
    guildMember: GuildMember,
    interaction: ButtonInteraction,
  ) => void;
}
