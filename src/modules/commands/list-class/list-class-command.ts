import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import {
  getCharactersByClass,
  getOrCreateMember,
} from '../../../database/handlers';
import { GuildMember } from '../../../types';
import { SetCharacterClasses } from '../set-character/set-character-command';

export const commandName = 'list_class' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('List all characters from a specific class in the guild')
  .addStringOption((option) =>
    option
      .setName('class')
      .setDescription('The class to filter by')
      .setRequired(true)
      .addChoices(SetCharacterClasses),
  );

export const listClassCommandData = {
  commandName,
  commandData,
} as const;

const pageSize = 5; // Number of characters per page
const userClassPages = new Map<string, { className: string; page: number }>();

const createEmbed = (characters, className, page, totalPages) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, characters.length);

  const embed = new EmbedBuilder()
    .setTitle(`Character List - Class: ${className}`)
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
      .setCustomId('list-class-prev')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId('list-class-next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === totalPages),
  );
};

export async function listClassCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  const options =
    interaction.options as CommandInteractionOptionResolver<CacheType>;

  const guildId = interaction.guildId;
  const userId = interaction.user.id;
  const className = options.getString('class', true);

  await getOrCreateMember(guildId, userId);
  const characters = await getCharactersByClass(guildId, className);

  if (characters.length === 0) {
    return interaction.reply({
      content: `No characters found for class **${className}** in this guild.`,
      ephemeral: true,
    });
  }

  const totalPages = Math.ceil(characters.length / pageSize);
  userClassPages.set(userId, { className, page: 1 });

  await interaction.reply({
    embeds: [createEmbed(characters, className, 1, totalPages)],
    components: [createButtons(1, totalPages)],
    ephemeral: true,
  });
}

// 🎯 Button Interaction Handling
export async function handleListClassButton(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  if (!['list-class-prev', 'list-class-next'].includes(interaction.customId)) {
    return;
  }

  const userId = interaction.user.id;
  const userState = userClassPages.get(userId);
  if (!userState) return;

  const { className, page } = userState;
  const characters = await getCharactersByClass(interaction.guildId, className);
  const totalPages = Math.ceil(characters.length / pageSize);

  let newPage = page;
  if (interaction.customId === 'list-class-prev' && page > 1) {
    newPage--;
  } else if (interaction.customId === 'list-class-next' && page < totalPages) {
    newPage++;
  }

  userClassPages.set(userId, { className, page: newPage });

  await interaction.update({
    embeds: [createEmbed(characters, className, newPage, totalPages)],
    components: [createButtons(newPage, totalPages)],
  });
}
