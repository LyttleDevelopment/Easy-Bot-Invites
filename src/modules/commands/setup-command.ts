import { GuildMember } from '../../types';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  PermissionFlagsBits,
  SelectMenuBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../interactions/commands/command-types';

export const commandName = 'invite_setup' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('Setup guild')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const setupCommandData = {
  commandName,
  commandData,
} as const;

// Keep track of active setup conversations using map
const activeSetupConversations = new Map<string, CommandInteraction>();

export async function setupCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  // Create hidden message with buttons yes and no for following questions. Keep it in mind of activeSetupConversations and remove it after conversation ends (button events need seperate function)
  // 1. Role Setup:  Bot asks: "Have you set up roles on the server?" (Y/N)  If "N", bot sends a DM advising the admin to set up roles and restart the setup later.

  // Check if user is already in setup conversation
  if (activeSetupConversations.has(interaction.user.id)) {
    activeSetupConversations.delete(interaction.user.id);
  }

  // Start setup conversation

  // Add user to activeSetupConversations
  activeSetupConversations.set(interaction.user.id, interaction);

  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_1_yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('setup-command_no')
      .setLabel('No')
      .setStyle(ButtonStyle.Danger),
  );

  // Send message with buttons
  await interaction.reply({
    content: 'Have you set up roles on the server?',
    components: [buttonsRow],
    ephemeral: true,
  });
}

export async function setupCommandNo(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // If "N", bot sends a DM advising the admin to set up roles and restart the setup later.
  const commandInteraction = activeSetupConversations.get(interaction.user.id);
  await commandInteraction.editReply({
    content: 'Please set up roles and restart the setup later',
    components: [],
  });

  // Remove user from activeSetupConversations
  activeSetupConversations.delete(interaction.user.id);

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommand1Yes(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // If the answer is "Y", bot asks: "Have you set up a text channel with server and/or raid rules?" (Y/N)
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_2_yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('setup-command_no')
      .setLabel('No')
      .setStyle(ButtonStyle.Danger),
  );

  // Update interaction message and buttons
  const commandInteraction = activeSetupConversations.get(interaction.user.id);
  await commandInteraction.editReply({
    content: 'Have you set up a text channel with server and/or raid rules?',
    components: [buttonsRow],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommand2Yes(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // If both previous answers are "Y", bot asks: "Are there server rules, raid rules, or both?" (Admin responds with a number: 1. Server Rules, 2. Raid Rules, 3. Both)
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_3_yes1')
      .setLabel('Only server rules')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('setup-command_3_yes2')
      .setLabel('Only raid rules')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('setup-command_3_yes')
      .setLabel('Both')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('setup-command_no')
      .setLabel('None')
      .setStyle(ButtonStyle.Danger),
  );

  // Update interaction message and buttons
  const commandInteraction = activeSetupConversations.get(interaction.user.id);
  await commandInteraction.editReply({
    content: 'Are there server rules, raid rules, or both?',
    components: [buttonsRow],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommand3Yes(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const commandInteraction = activeSetupConversations.get(interaction.user.id);

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    new SelectMenuBuilder()
      .setCustomId('setup-command_roles')
      .setPlaceholder('Select roles')
      .setMinValues(1)
      .setMaxValues(interaction.guild.roles.cache.size)
      .addOptions(
        interaction.guild.roles.cache.map((role) => ({
          label: role.name,
          value: role.id,
        })),
      ),
  );

  await commandInteraction.editReply({
    content: 'Setup completed',
    components: [row],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandENDYes(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const commandInteraction = activeSetupConversations.get(interaction.user.id);
  await commandInteraction.editReply({
    content: 'Setup completed',
    components: [],
  });

  // Remove user from activeSetupConversations
  activeSetupConversations.delete(interaction.user.id);

  // Defer update
  await interaction.deferUpdate();
}
