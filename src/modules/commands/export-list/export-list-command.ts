import {
  AttachmentBuilder,
  CacheType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import {
  getGuildCharacters,
  getOrCreateMember,
} from '../../../database/handlers'; // Function to get all characters
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { GuildMember } from '../../../types';

export const commandName = 'export_list' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('Export the list of characters from the guild into a file')
  .addStringOption((option) =>
    option
      .setName('format')
      .setDescription('Choose the export format')
      .setRequired(true)
      .addChoices(
        { name: 'CSV', value: 'csv' },
        {
          name: 'JSON',
          value: 'json',
        },
      ),
  );

export const exportListCommandData = {
  commandName,
  commandData,
} as const;

export async function exportListCommand(
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
  // Get the export format from the user input
  const format = options.getString('format', true);

  // Fetch all characters in the guild
  const characters = await getGuildCharacters(guildId);

  if (characters.length === 0) {
    return interaction.reply({
      content: 'No characters found in this guild to export.',
      options: { ephemeral: true },
    });
  }

  // Function to convert BigInt to string for serialization
  const convertBigIntToString = (obj: any): any => {
    if (typeof obj === 'bigint') {
      return obj.toString();
    }
    if (Array.isArray(obj)) {
      return obj.map(convertBigIntToString);
    }
    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = convertBigIntToString(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  // Prepare the data for export
  let fileContent: string;

  if (format === 'csv') {
    // Convert the characters to CSV format
    const headers = [
      'Name',
      'Class',
      'Main Spec',
      'Off Spec',
      'Main/Alt',
      'Guild ID',
    ];
    const rows = characters
      .map((char) => [
        char.character_name,
        char.class,
        char.main_spec,
        char.off_spec,
        char.main_or_alt,
        char.guild_id.toString(), // Convert BigInt to string for CSV
      ])
      .map((row) => row.join(','))
      .join('\n');

    fileContent = `${headers.join(',')}\n${rows}`;
  } else if (format === 'json') {
    // Convert the characters to JSON format with BigInt converted to string
    const charactersWithBigIntAsString = convertBigIntToString(characters);
    fileContent = JSON.stringify(charactersWithBigIntAsString, null, 2);
  } else {
    return interaction.reply({
      content: 'Invalid format selected.',
      options: { ephemeral: true },
    });
  }

  // Create the file for export
  const fileName = `characters_list.${format}`;
  const filePath = path.join(__dirname, fileName);
  await promisify(fs.writeFile)(filePath, fileContent);

  // Create the attachment to send to the user
  const fileAttachment = new AttachmentBuilder(filePath, { name: fileName });

  // Send the file as an attachment
  await interaction.reply({
    content: `Here is the list of characters in the guild exported as ${format.toUpperCase()}:`,
    files: [fileAttachment],
    options: { ephemeral: true },
  });

  // Clean up the file after sending
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting temp file:', err);
    }
  });
}
