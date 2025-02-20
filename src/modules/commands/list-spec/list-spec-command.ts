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
  getCharactersBySpec,
  getOrCreateMember,
} from '../../../database/handlers';
import { GuildMember } from '../../../types';
import { SetCharacterSpecs } from '../set-character/set-character-command';

export const commandName = 'list_spec' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(
    'List all characters from a specific specialization in the guild',
  )
  .addStringOption((option) =>
    option
      .setName('spec')
      .setDescription('The specialization to filter by')
      .setRequired(true)
      .addChoices(SetCharacterSpecs),
  );

export const listSpecCommandData = {
  commandName,
  commandData,
} as const;

const pageSize = 5;
const userSpecPages = new Map<string, { spec: string; page: number }>();

const createEmbed = (characters, spec, page, totalPages) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, characters.length);

  const embed = new EmbedBuilder()
    .setTitle(`Character List - Specialization: ${spec}`)
    .setColor('#00FF00')
    .setFooter({ text: `Page ${page} of ${totalPages}` });

  const characterList = characters
    .slice(startIndex, endIndex)
    .map(
      (char) =>
        `**${char.character_name}** - ${char.main_or_alt} | ${char.main_spec} (${char.off_spec})\n- **Class:** ${char.class}\n- **Main Spec:** ${char.main_spec}\n- **Off Spec:** ${char.off_spec}\n`,
    )
    .join('\n');

  embed.setDescription(characterList || 'No characters found.');

  return embed;
};

const createButtons = (page, totalPages) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('list-spec-prev')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId('list-spec-next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === totalPages),
  );
};

export async function listSpecCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  const options =
    interaction.options as CommandInteractionOptionResolver<CacheType>;

  const guildId = interaction.guildId;
  const userId = interaction.user.id;
  const spec = options.getString('spec', true);

  await getOrCreateMember(guildId, userId);
  const characters = await getCharactersBySpec(guildId, spec);

  if (characters.length === 0) {
    return interaction.reply({
      content: `No characters found for specialization **${spec}** in this guild.`,
      ephemeral: true,
    });
  }

  const totalPages = Math.ceil(characters.length / pageSize);
  userSpecPages.set(userId, { spec, page: 1 });

  await interaction.reply({
    embeds: [createEmbed(characters, spec, 1, totalPages)],
    components: [createButtons(1, totalPages)],
    ephemeral: true,
  });
}

// 🎯 Button Interaction Handling
export async function handleListSpecButton(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  if (!['list-spec-prev', 'list-spec-next'].includes(interaction.customId)) {
    return;
  }

  const userId = interaction.user.id;
  const userState = userSpecPages.get(userId);
  if (!userState) return;

  const { spec, page } = userState;
  const characters = await getCharactersBySpec(interaction.guildId, spec);
  const totalPages = Math.ceil(characters.length / pageSize);

  let newPage = page;
  if (interaction.customId === 'list-spec-prev' && page > 1) {
    newPage--;
  } else if (interaction.customId === 'list-spec-next' && page < totalPages) {
    newPage++;
  }

  userSpecPages.set(userId, { spec, page: newPage });

  await interaction.update({
    embeds: [createEmbed(characters, spec, newPage, totalPages)],
    components: [createButtons(newPage, totalPages)],
  });
}
