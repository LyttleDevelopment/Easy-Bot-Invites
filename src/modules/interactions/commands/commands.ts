import {
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import {
  exportListCommandData,
  inviteCommandData,
  listAllCommandData,
  listClassCommandData,
  listSpecCommandData,
  purgeCommandData,
  setCharacterCommandData,
  setupCommandData,
} from '../../commands';

type CommandEntry = {
  readonly commandName: string;
  readonly commandData: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
};

/**
 * All registered commands DATA
 * !! Not typed, so we can detect the command name !!
 */
export const commands = [
  exportListCommandData,
  inviteCommandData,
  listAllCommandData,
  listClassCommandData,
  listSpecCommandData,
  purgeCommandData,
  setCharacterCommandData,
  setupCommandData,
] as const satisfies readonly CommandEntry[];
