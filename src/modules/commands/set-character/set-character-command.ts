import {
  CacheType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import { createCharacter, getOrCreateMember } from '../../../database/handlers';
import { GuildMember } from '../../../types';

export const commandName = 'set_character' as const;

export const SetCharacterClasses: { name: string; value: string }[] = [
  { name: 'Demon Hunter', value: 'Demon Hunter' },
  { name: 'Druid', value: 'Druid' },
  { name: 'Hunter', value: 'Hunter' },
  { name: 'Mage', value: 'Mage' },
  { name: 'Paladin', value: 'Paladin' },
  { name: 'Priest', value: 'Priest' },
  { name: 'Rogue', value: 'Rogue' },
  { name: 'Shaman', value: 'Shaman' },
  { name: 'Warlock', value: 'Warlock' },
  { name: 'Warrior', value: 'Warrior' },
];

export const SetCharacterSpecs: { name: string; value: string }[] = [
  { name: 'Affliction', value: 'Affliction' },
  { name: 'Arcane', value: 'Arcane' },
  { name: 'Arms', value: 'Arms' },
  { name: 'Assassination', value: 'Assassination' },
  { name: 'Balance', value: 'Balance' },
  { name: 'Beast Mastery', value: 'Beast Mastery' },
  { name: 'Combat', value: 'Combat' },
  { name: 'Demonology', value: 'Demonology' },
  { name: 'Destruction', value: 'Destruction' },
  { name: 'Discipline', value: 'Discipline' },
  { name: 'Elemental', value: 'Elemental' },
  { name: 'Enchantment', value: 'Enchantment' },
  { name: 'Fire', value: 'Fire' },
  { name: 'Frost', value: 'Frost' },
  { name: 'Fury', value: 'Fury' },
];

// Define allowed specs per class
export const allowedSpecsByClass: Record<string, string[]> = {
  Druid: ['Feral Bear', 'Feral Cat', 'Balance', 'Restoration'],
  Hunter: ['Marksmanship', 'Beast Mastery', 'Survival'],
  Mage: ['Frost', 'Fire', 'Arcane'],
  Paladin: ['Protection', 'Retribution', 'Holy'],
  Priest: ['Shadow', 'Holy', 'Discipline'],
  Rogue: ['Assassination', 'Combat', 'Subtlety'],
  Warlock: ['Affliction', 'Demonology', 'Destruction'],
  Warrior: ['Protection', 'Fury', 'Arms'],
  Shaman: ['Enchantment', 'Elemental', 'Restoration'],
};

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
      options: { ephemeral: true },
    });
  }

  // Validate that the selected specs are allowed for the chosen class
  const allowedSpecs = allowedSpecsByClass[characterClass];
  if (!allowedSpecs) {
    return interaction.reply({
      content: `No allowed specs have been defined for class "${characterClass}".`,
      options: { ephemeral: true },
    });
  }

  if (!allowedSpecs.includes(mainSpec)) {
    return interaction.reply({
      content: `The main spec "${mainSpec}" is not valid for a ${characterClass}. Valid options are: ${allowedSpecs.join(
        ', ',
      )}.`,
      options: { ephemeral: true },
    });
  }

  if (!allowedSpecs.includes(offSpec)) {
    return interaction.reply({
      content: `The off spec "${offSpec}" is not valid for a ${characterClass}. Valid options are: ${allowedSpecs.join(
        ', ',
      )}.`,
      options: { ephemeral: true },
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
    options: { ephemeral: true },
  });
}
