import {
  CacheType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import { createCharacter, getOrCreateMember } from '../../../database/handlers';
import { GuildMember } from '../../../types';

export const commandName = 'set_character' as const;

export const SetCharacterClasses = [
  { name: 'Warrior', value: 'Warrior' },
  { name: 'Paladin', value: 'Paladin' },
  { name: 'Hunter', value: 'Hunter' },
  { name: 'Rogue', value: 'Rogue' },
  { name: 'Priest', value: 'Priest' },
  { name: 'Death Knight', value: 'Death Knight' },
  { name: 'Shaman', value: 'Shaman' },
  { name: 'Mage', value: 'Mage' },
  { name: 'Warlock', value: 'Warlock' },
  { name: 'Druid', value: 'Druid' },
  { name: 'Demon Hunter', value: 'Demon Hunter' },
  { name: 'Monk', value: 'Monk' },
];

export const SetCharacterSpecs = [
  { name: 'Arms', value: 'Arms' },
  { name: 'Fury', value: 'Fury' },
  { name: 'Protection', value: 'Protection' },
  { name: 'Fire', value: 'Fire' },
  { name: 'Frost', value: 'Frost' },
  { name: 'Holy', value: 'Holy' },
  { name: 'Discipline', value: 'Discipline' },
  { name: 'Shadow', value: 'Shadow' },
  { name: 'Outlaw', value: 'Outlaw' },
  { name: 'Assassination', value: 'Assassination' },
  { name: 'Beast Mastery', value: 'Beast Mastery' },
  { name: 'Marksmanship', value: 'Marksmanship' },
  { name: 'Survival', value: 'Survival' },
  { name: 'Balance', value: 'Balance' },
  { name: 'Restoration', value: 'Restoration' },
];

export const SetCharacterType = [
  { name: 'Main', value: 'Main' },
  {
    name: 'Alt',
    value: 'Alt',
  },
];

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('Set your character details')
  .addStringOption((option) =>
    option.setName('name').setDescription('Character Name').setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('class')
      .setDescription('Character Class')
      .setRequired(true)
      .addChoices(SetCharacterClasses),
  )
  .addStringOption((option) =>
    option
      .setName('main_spec')
      .setDescription('Main Spec')
      .setRequired(true)
      .addChoices(SetCharacterSpecs),
  )
  .addStringOption((option) =>
    option
      .setName('off_spec')
      .setDescription('Off Spec')
      .setRequired(true)
      .addChoices(SetCharacterSpecs),
  )
  .addStringOption((option) =>
    option
      .setName('main_or_alt')
      .setDescription('Is this your Main or Alt?')
      .setRequired(true)
      .addChoices(SetCharacterType),
  );

export const setCharacterCommandData = {
  commandName,
  commandData,
} as const;

export async function setCharacterCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  // Ensure interaction.options has correct type
  const options =
    interaction.options as CommandInteractionOptionResolver<CacheType>;

  // Extract user input
  const guildId = interaction.guildId;
  const userId = interaction.user.id;
  const characterName = options.getString('name', true);
  const characterClass = options.getString('class', true);
  const mainSpec = options.getString('main_spec', true);
  const offSpec = options.getString('off_spec', true);
  const mainOrAlt = options.getString('main_or_alt', true);

  if (!guildId) {
    return interaction.reply({
      content: 'This command must be used in a server.',
      flags: MessageFlags.Ephemeral,
    });
  }

  // Ensure the user is registered in the guild
  await getOrCreateMember(guildId, userId);

  // Save character to database
  await createCharacter(
    guildId,
    userId,
    characterName,
    characterClass,
    mainSpec,
    offSpec,
    mainOrAlt,
  );

  // Reply to user
  await interaction.reply({
    content: `✅ Character **${characterName}** (${characterClass}) has been set!\n- **Main Spec:** ${mainSpec}\n- **Off Spec:** ${offSpec}\n- **Main/Alt:** ${mainOrAlt}`,
    flags: MessageFlags.Ephemeral,
  });
}
