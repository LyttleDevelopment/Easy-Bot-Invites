import { GuildMember } from '../../types';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from './handler/command-types';

export const commandName = 'invite_setup' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('Setup guild');

export const setupCommandData = {
  commandName,
  commandData,
} as const;

export async function setupCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  await interaction.reply('Hello World!');
}
