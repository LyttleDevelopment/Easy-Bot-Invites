import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import {
  getGuildCharacters,
  getOrCreateMember,
} from '../../../database/handlers';
import { GuildMember } from '../../../types';

export const commandName = 'list_all' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('List all characters in the guild');

export const listAllCommandData = {
  commandName,
  commandData,
} as const;

const pageSize = 5; // Number of characters per page

const createEmbed = (characters, page, totalPages) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, characters.length);

  const embed = new EmbedBuilder()
    .setTitle('Guild Character List')
    .setColor('#00FF00')
    .setFooter({ text: `Page ${page} of ${totalPages}` });

  const characterList = characters
    .slice(startIndex, endIndex)
    .map(
      (char) =>
        `(<@${char.user_id}>) **${char.character_name}** - ${char.main_or_alt} | ${char.class}\n- **Main Spec:** ${char.main_spec}\n- **Off Spec:** ${char.off_spec}\n`,
    )
    .join('\n');

  embed.setDescription(characterList || 'No characters found.');

  return embed;
};

const createButtons = (page, totalPages) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('list-all-prev')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId('list-all-next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === totalPages),
  );
};

// Map to store user page states
const userPages = new Map<string, number>();

export async function listAllCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  const guildId = interaction.guildId;
  const userId = interaction.user.id;

  await getOrCreateMember(guildId, userId);
  const characters = await getGuildCharacters(guildId);

  if (characters.length === 0) {
    return interaction.reply({
      content: 'No characters are registered in the guild.',
      ephemeral: true,
    });
  }

  const totalPages = Math.ceil(characters.length / pageSize);
  userPages.set(userId, 1); // Store initial page for user

  await interaction.reply({
    embeds: [createEmbed(characters, 1, totalPages)],
    components: [createButtons(1, totalPages)],
    ephemeral: true,
  });
}

// 🎯 Button Interaction Handling
export async function handleListAllButton(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  if (!['list-all-prev', 'list-all-next'].includes(interaction.customId)) {
    return;
  }

  const userId = interaction.user.id;
  const characters = await getGuildCharacters(interaction.guildId);
  const totalPages = Math.ceil(characters.length / pageSize);

  let currentPage = userPages.get(userId) || 1;

  if (interaction.customId === 'list-all-prev' && currentPage > 1) {
    currentPage--;
  } else if (
    interaction.customId === 'list-all-next' &&
    currentPage < totalPages
  ) {
    currentPage++;
  }

  userPages.set(userId, currentPage); // Update page state

  await interaction.update({
    embeds: [createEmbed(characters, currentPage, totalPages)],
    components: [createButtons(currentPage, totalPages)],
  });
}
