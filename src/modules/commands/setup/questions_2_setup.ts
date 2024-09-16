import { activeSetupConversations, getStatus, sendOk } from './setup-command';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  ChannelType,
  SelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { GuildMember } from '../../../types';
import { setupCommandGetValidationNo } from './questions_1_validation';

const prefix = `# Setup Configuration\n\n`;
const suffix = `\n** **`;

export async function setupCommandSetupRoles(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
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

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Define how many roles will be granted permission to use the bot for creating invite links.' +
      suffix,
    components: [row, row2],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandSetupRoleRoles(
  guildMember: GuildMember,
  interaction: StringSelectMenuInteraction,
) {
  const roles = interaction.values.map((roleId) =>
    interaction.guild.roles.cache.get(roleId),
  );

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupAdminRoles: roles,
  });

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('setup-command_role-roles')
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

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Assign server roles to different invite link type:\n- Guild Invite Link' +
      suffix,
    components: [row, row2],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandSetupRoleRoles2(
  guildMember: GuildMember,
  interaction: StringSelectMenuInteraction,
) {
  const roles = interaction.values.map((roleId) =>
    interaction.guild.roles.cache.get(roleId),
  );

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupGuildRoles: roles,
  });

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('setup-command_role-roles2')
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

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Assign server roles to different invite link type:\n- Pug Invite Link' +
      suffix,
    components: [row, row2],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandSetupAnnouncementChannel(
  guildMember: GuildMember,
  interaction: StringSelectMenuInteraction,
) {
  const roles = interaction.values.map((roleId) =>
    interaction.guild.roles.cache.get(roleId),
  );

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupPugRoles: roles,
  });

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId('setup-command_announcement-channel')
      .setPlaceholder('Select channel')
      .setChannelTypes([ChannelType.GuildText]),
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Select the text channel where the bot posts details of the invitee (name of invitee, creator of the invite, date joined).' +
      suffix,
    components: [row, row2],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandSetupServerRulesChannel(
  guildMember: GuildMember,
  interaction: ChannelSelectMenuInteraction,
) {
  const channel = interaction.guild.channels.cache.get(interaction.values[0]);

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupAnnouncementChannel: channel,
  });

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId('setup-command_server-rules-channel')
      .setPlaceholder('Select channel')
      .setChannelTypes([ChannelType.GuildText]),
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Define which text channel contains the server rules.' +
      suffix,
    components: [row, row2],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandSetupRaidRulesChannel(
  guildMember: GuildMember,
  interaction: ChannelSelectMenuInteraction,
) {
  const channel = interaction.guild.channels.cache.get(interaction.values[0]);

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupServerRulesChannel: channel,
  });

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId('setup-command_raid-rules-channel')
      .setPlaceholder('Select channel')
      .setChannelTypes([ChannelType.GuildText]),
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Define which text channel contains the raid rules.' +
      suffix,
    components: [row, row2],
  });

  // Defer update
  await interaction.deferUpdate();
}

export async function setupCommandSetupMessageGuildInvite(
  guildMember: GuildMember,
  interaction: ChannelSelectMenuInteraction,
) {
  const channel = interaction.guild.channels.cache.get(interaction.values[0]);

  // Update interaction message and buttons
  const asc = activeSetupConversations.get(interaction.user.id);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  activeSetupConversations.set(interaction.user.id, {
    ...asc,
    setupRaidRulesChannel: channel,
  });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Set up different welcome messages: (send in chat)\n-  For Guild Invitees' +
      suffix,
    components: [row],
  });

  // Defer update
  await interaction.deferUpdate();
}
