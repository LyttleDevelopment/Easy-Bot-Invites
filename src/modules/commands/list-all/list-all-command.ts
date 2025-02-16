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
      options: { ephemeral: true },
    });
  }

  // Pagination settings
  const pageSize = 10; // Number of items per page
  const totalPages = Math.ceil(characters.length / pageSize);
  let currentPage = 1;

  // Helper function to create embed message for listing
  const createEmbed = (page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, characters.length);

    const embed = new EmbedBuilder()
      .setTitle('Guild Character List')
      .setDescription(`Page ${page} of ${totalPages}`)
      .setColor('#00FF00');

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
  const createButtons = (page: number) => {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('prev_page')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 1), // Disable if on the first page
      new ButtonBuilder()
        .setCustomId('next_page')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === totalPages), // Disable if on the last page
    );

    return row;
  };

  // Send the initial message
  const embed = createEmbed(currentPage);
  const buttons = createButtons(currentPage);

  await interaction.reply({
    embeds: [embed],
    components: [buttons],
    options: { ephemeral: true },
  });

  // Handle button interactions for pagination
  const filter = (buttonInteraction) =>
    buttonInteraction.user.id === interaction.user.id;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 60_000, // Collector time (60 seconds)
  });

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.customId === 'prev_page' && currentPage > 1) {
      currentPage--;
    } else if (
      buttonInteraction.customId === 'next_page' &&
      currentPage < totalPages
    ) {
      currentPage++;
    }

    // Update the embed and buttons
    const updatedEmbed = createEmbed(currentPage);
    const updatedButtons = createButtons(currentPage);

    await buttonInteraction.update({
      embeds: [updatedEmbed],
      components: [updatedButtons],
    });
  });

  collector.on('end', async () => {
    // Disable buttons after the collector ends (timeout or manual cancel)
    const disabledButtons = createButtons(currentPage);
    await interaction.editReply({
      components: [disabledButtons],
    });
  });
}
