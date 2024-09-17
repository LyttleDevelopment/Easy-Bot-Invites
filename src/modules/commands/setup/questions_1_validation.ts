import { GuildMember } from '../../../types';
import {
  ActionRowBuilder,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
} from 'discord.js';
import {
  setupCommandSetupFinish,
  setupCommandSetupRoleRoles,
  setupCommandSetupRoles,
} from './questions_2_setup';
import {
  ascUpdateComponents,
  getActiveSetupConversations,
  removeActiveSetupConversations,
  sendOk,
  setActiveSetupConversations,
} from './setup-command-utils';

const prefix = `# Setup Validation\n\n`;
const suffix = `\n** **`;

export async function setupCommandValidation1(
  guildMember: GuildMember,
  interaction?: CommandInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandValidation1Yes,
    previousAction: setupCommandSetupFinish,
  });

  const asc = getActiveSetupConversations(guildMember);

  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_1_yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    setupCommandGetValidationNo(),
  );

  const options = {
    content: prefix + 'Have you set up roles on the server?' + suffix,
    components: ascUpdateComponents(guildMember, [buttonsRow]),
    ephemeral: true,
  };

  // Send message with buttons
  if (interaction) {
    if (interaction.replied) {
      await interaction.editReply(options);
      return;
    }
    await interaction?.reply(options);
    return;
  }
  await asc.interaction?.editReply(options);
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
  const { interaction: commandInteraction } =
    getActiveSetupConversations(guildMember);
  await sendOk(commandInteraction);
  await commandInteraction.editReply({
    content:
      prefix +
      'Please set up roles, channels & rules and restart the setup afterwards' +
      suffix,
    components: [],
  });

  // Remove user from activeSetupConversations
  removeActiveSetupConversations(guildMember);

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandValidation1Yes(
  guildMember: GuildMember,
  interaction?: ButtonInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandValidation2Yes,
    previousAction: setupCommandValidation1,
  });

  // If the answer is "Y", bot asks: "Have you set up a text channel with server and/or raid rules?" (Y/N)
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_2_yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    setupCommandGetValidationNo(),
  );

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;

  setActiveSetupConversations(guildMember, {
    setupRole: true,
  });

  await sendOk(commandInteraction);
  await commandInteraction.editReply({
    content:
      prefix +
      'Have you set up a text channel with server and/or raid rules?' +
      suffix,
    components: ascUpdateComponents(guildMember, [buttonsRow]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandValidation2Yes(
  guildMember: GuildMember,
  interaction?: ButtonInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandValidation3YesBoth,
    previousAction: setupCommandValidation1Yes,
  });

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
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;

  setActiveSetupConversations(guildMember, {
    setupChannel: true,
  });

  await sendOk(commandInteraction);
  await commandInteraction.editReply({
    content: prefix + 'Are there server rules, raid rules, or both?' + suffix,
    components: ascUpdateComponents(guildMember, [buttonsRow]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandValidation3YesBoth(
  guildMember: GuildMember,
  interaction?: ButtonInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupRoleRoles,
    previousAction: setupCommandValidation2Yes,
    setupRaidRules: true,
    setupGuildRules: true,
  });

  return setupCommandSetupRoles(guildMember, interaction);
}

export async function setupCommandValidation3YesServer(
  guildMember: GuildMember,
  interaction?: ButtonInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupRoleRoles,
    previousAction: setupCommandValidation2Yes,
    setupGuildRules: true,
  });

  return setupCommandSetupRoles(guildMember, interaction);
}

export async function setupCommandValidation3YesRaid(
  guildMember: GuildMember,
  interaction?: ButtonInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupRoleRoles,
    previousAction: setupCommandValidation2Yes,
    setupRaidRules: true,
  });

  return setupCommandSetupRoles(guildMember, interaction);
}
