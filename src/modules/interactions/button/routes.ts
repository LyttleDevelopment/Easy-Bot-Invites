import { ButtonInteraction } from 'discord.js';
import { GuildMember } from '../../../types';
import {
  setupCommandValidation1Yes,
  setupCommandValidation2Yes,
  setupCommandValidation3YesBoth,
  setupCommandValidation3YesRaid,
  setupCommandValidation3YesServer,
  setupCommandValidationNo,
} from '../../commands/setup/questions_1_validation';

/**
 * All routes for button presses
 * customId: Function
 */
export const buttonRoutes: ButtonRoutes = {
  'setup-command_1_yes': setupCommandValidation1Yes,
  'setup-command_2_yes': setupCommandValidation2Yes,
  'setup-command_3_yes_both': setupCommandValidation3YesBoth,
  'setup-command_3_yes_server': setupCommandValidation3YesServer,
  'setup-command_3_yes_raid': setupCommandValidation3YesRaid,
  'setup-command_no': setupCommandValidationNo,
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
