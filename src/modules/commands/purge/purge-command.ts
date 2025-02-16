import {
  CacheType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionsBitField,
  SlashCommandBuilder,
  User,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import {
  deleteCharacterByName,
  deleteCharactersByMember,
  getOrCreateGuild,
  getOrCreateMember,
} from '../../../database/handlers';
import { GuildMember } from '../../../types';
import client from '../../../main';

export const commandName = 'purge' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(
    'Remove a character or all characters of a member from the guild',
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('character')
      .setDescription('Delete a specific character')
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('The character name to purge')
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('member')
      .setDescription('Delete all characters of a member')
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('The Discord user whose characters should be deleted')
          .setRequired(true),
      ),
  );

export const purgeCommandData = {
  commandName,
  commandData,
} as const;

async function checkAdminOrOfficer(
  guildMember: GuildMember,
  interaction: CommandInteraction,
): Promise<boolean> {
  const guild = await getOrCreateGuild(guildMember.guildId);
  const adminRoles = guild.admin_roles.split(',');

  // Get the Discord Guild Member
  const discordMember = client.guilds.cache
    .get(guildMember.guildId)
    ?.members.cache.get(interaction.user.id);

  if (!discordMember) {
    await interaction.reply({
      content: 'Unable to fetch your role information.',
      ephemeral: true,
    });
    return false;
  }

  // Check if the user has any of the required roles or is an admin
  const hasPermission =
    discordMember.permissions.has(PermissionsBitField.Flags.Administrator) ||
    adminRoles.some((roleId) => discordMember.roles.cache.has(roleId));

  if (!hasPermission) {
    await interaction.reply({
      content: 'You do not have permission to purge characters.',
      ephemeral: true,
    });
    return false;
  }

  return true;
}

export async function purgeCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  const guildId = interaction.guildId;
  const userId = interaction.user.id;

  // Ensure the user is a member of the guild
  await getOrCreateMember(guildId, userId);

  // Ensure interaction.options has correct type
  const options =
    interaction.options as CommandInteractionOptionResolver<CacheType>;

  // Check if the user has admin or officer privileges
  if (!(await checkAdminOrOfficer(guildMember, interaction))) return;

  const subcommand = options.getSubcommand();

  if (subcommand === 'character') {
    // Purge by character name
    const characterName = options.getString('name', true);
    const deletedCount = await deleteCharacterByName(guildId, characterName);

    if (deletedCount === 0) {
      await interaction.reply({
        content: `No character found with the name **${characterName}** in this guild.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Successfully removed **${deletedCount}** character(s) with the name **${characterName}** from the guild.`,
      });
    }
  } else if (subcommand === 'member') {
    // Purge all characters of a specific member
    const discordUser: User = options.getUser('user', true);
    const memberId = discordUser.id;
    const deletedCount = await deleteCharactersByMember(guildId, memberId);

    if (deletedCount === 0) {
      await interaction.reply({
        content: `No characters found for **${discordUser.username}** in this guild.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Successfully removed **${deletedCount}** character(s) belonging to **${discordUser.username}** from the guild.`,
      });
    }
  }
}
