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
import {
  setupCommandNavigateNext,
  setupCommandNavigatePrevious,
} from '../../commands/setup/setup-command-utils';
import {
  setupCommandRestart,
  setupCommandSave,
} from '../../commands/setup/questions_3_conformation';
import { inviteCommandCreate } from '../../commands/invite/invite-command';

/**
 * All routes for button presses
 * customId: Function
 */
export const buttonRoutes: ButtonRoutes = {
  'setup-command_next': setupCommandNavigateNext,
  'setup-command_previous': setupCommandNavigatePrevious,
  'setup-command_1_yes': setupCommandValidation1Yes,
  'setup-command_2_yes': setupCommandValidation2Yes,
  'setup-command_3_yes_both': setupCommandValidation3YesBoth,
  'setup-command_3_yes_server': setupCommandValidation3YesServer,
  'setup-command_3_yes_raid': setupCommandValidation3YesRaid,
  'setup-command_no': setupCommandValidationNo,
  'setup-command_save': setupCommandSave,
  'setup-command_restart': setupCommandRestart,
  invite__guild: (guildMember: GuildMember, interaction: ButtonInteraction) =>
    inviteCommandCreate(guildMember, interaction, 'guild'),
  invite__pug__raid: (
    guildMember: GuildMember,
    interaction: ButtonInteraction,
  ) => inviteCommandCreate(guildMember, interaction, 'pug__raid'),
  invite__pug__stay: (
    guildMember: GuildMember,
    interaction: ButtonInteraction,
  ) => inviteCommandCreate(guildMember, interaction, 'pug__stay'),
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
