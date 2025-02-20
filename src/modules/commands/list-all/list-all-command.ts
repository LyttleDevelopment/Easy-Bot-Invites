import {
  ActionRowBuilder,
  ButtonBuilder,
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

export async function listAllCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  const guildId = interaction.guildId;
  const userId = interaction.user.id;

  // Ensure the user is a member of the guild
  await getOrCreateMember(guildId, userId);

  // Fetch all characters for this guild
  const characters = await getGuildCharacters(guildId);

  if (characters.length === 0) {
    return interaction.reply({
      content: 'No characters are registered in the guild.',
      ephemeral: true, // Correct placement of ephemeral
    });
  }

  // Pagination settings
  const pageSize = 5; // Number of items per page
  const totalPages = Math.ceil(characters.length / pageSize);
  let currentPage = 1;

  // Acknowledge the interaction immediately to prevent expiration
  await interaction.deferReply({ ephemeral: true });

  // Helper function to create embed message for listing
  const createEmbed = (page: number) => {
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

    embed.setDescription(characterList);

    return embed;
  };

  // Create buttons for pagination
  const createButtons = (page: number, disabled = false) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('prev_page')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled || page === 1), // Disable if on first page or collector ends
      new ButtonBuilder()
        .setCustomId('next_page')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled || page === totalPages), // Disable if on last page or collector ends
    );
  };

  // Send the initial message
  const embed = createEmbed(currentPage);
  const buttons = createButtons(currentPage);

  const message = await interaction.editReply({
    embeds: [embed],
    components: [buttons],
  });

  // Handle button interactions for pagination
  const collector = message.createMessageComponentCollector({
    filter: (buttonInteraction) =>
      buttonInteraction.user.id === interaction.user.id,
    time: 60_000, // 60 seconds timeout
  });

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.customId === 'prev_page' && currentPage > 1) {
      currentPage--;
    } else if (
      buttonInteraction.customId === 'next_page' &&
      currentPage < totalPages
    ) {
      currentPage++;
    } else {
      return; // Ignore invalid clicks
    }

    // Update the embed and buttons
    await buttonInteraction.update({
      embeds: [createEmbed(currentPage)],
      components: [createButtons(currentPage)],
    });
  });

  collector.on('end', async () => {
    // Disable buttons after timeout
    try {
      await interaction.editReply({
        components: [createButtons(currentPage, true)], // Disable buttons
      });
    } catch (error) {
      console.warn('Failed to edit reply after collector ended:', error);
    }
  });
}
