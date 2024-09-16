import { GuildMember } from '../../../types';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
} from 'discord.js';
import { activeSetupConversations, sendOk } from './setup-command';
import { setupCommandSetupRoles } from './questions_2_setup';

const prefix = `# Setup Validation\n\n`;
const suffix = `\n** **`;

export async function setupCommandValidation1(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_1_yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    setupCommandGetValidationNo(),
  );

  // Send message with buttons
  await interaction.reply({
    content: prefix + 'Have you set up roles on the server?' + suffix,
    components: [buttonsRow],
    ephemeral: true,
  });
}

export function setupCommandGetValidationNo(alternative?: boolean) {
  return new ButtonBuilder()
    .setCustomId('setup-command_no')
    .setLabel(alternative ? 'Cancel' : 'No')
    .setStyle(ButtonStyle.Danger);
}

export async function setupCommandValidationNo(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // If "N", bot sends a DM advising the admin to set up roles and restart the setup later.
  const { interaction: commandInteraction } = activeSetupConversations.get(
    interaction.user.id,
  );
  await sendOk(commandInteraction);
  await commandInteraction.editReply({
    content:
      prefix +
      'Please set up roles, channels & rules and restart the setup afterwards' +
      suffix,
    components: [],
  });

  // Remove user from activeSetupConversations
  activeSetupConversations.delete(interaction.user.id);

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandValidation1Yes(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // If the answer is "Y", bot asks: "Have you set up a text channel with server and/or raid rules?" (Y/N)
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_2_yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    setupCommandGetValidationNo(),
  );

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupRole: true,
  });

  await sendOk(commandInteraction);
  await commandInteraction.editReply({
    content:
      prefix +
      'Have you set up a text channel with server and/or raid rules?' +
      suffix,
    components: [buttonsRow],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandValidation2Yes(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // If both previous answers are "Y", bot asks: "Are there server rules, raid rules, or both?" (Admin responds with a number: 1. Server Rules, 2. Raid Rules, 3. Both)
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_3_yes_server')
      .setLabel('Only server rules')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('setup-command_3_yes_raid')
      .setLabel('Only raid rules')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('setup-command_3_yes_both')
      .setLabel('Both')
      .setStyle(ButtonStyle.Success),
    setupCommandGetValidationNo(),
  );

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupChannel: true,
  });

  await sendOk(commandInteraction);
  await commandInteraction.editReply({
    content: prefix + 'Are there server rules, raid rules, or both?' + suffix,
    components: [buttonsRow],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandValidation3YesBoth(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupRaidRules: true,
    setupGuildRules: true,
  });

  return setupCommandSetupRoles(guildMember, interaction);
}

export async function setupCommandValidation3YesServer(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupGuildRules: true,
  });

  return setupCommandSetupRoles(guildMember, interaction);
}

export async function setupCommandValidation3YesRaid(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupRaidRules: true,
  });

  return setupCommandSetupRoles(guildMember, interaction);
}
