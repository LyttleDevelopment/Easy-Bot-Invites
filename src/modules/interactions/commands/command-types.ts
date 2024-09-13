import {
  CommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { commands } from './commands';
import { GuildMember } from '../../../types';

/**
 * All registered commands DATA
 */
type RegisteredCommands = (typeof commands)[number]['commandName'];

/**
 * All routes/functions for command interactions interface
 */
export type CommandRoutes = {
  [key in RegisteredCommands]: (
    guildMember: GuildMember,
    interaction: CommandInteraction,
  ) => void;
};

/**
 * A single command
 */
export type Command =
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;
// export type Command = Omit<
//   SlashCommandBuilder,
//   'addSubcommand' | 'addSubcommandGroup'
// >;
