import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  ChannelType,
  Message,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { GuildMember } from '../../../types';
import { setupCommandGetValidationNo } from './questions_1_validation';
import { requestAwaitingMessage } from '../../interactions/message';
import {
  ascUpdateComponents,
  getActiveSetupConversations,
  getStatus,
  sendOk,
  setActiveSetupConversations,
} from './setup-command-utils';
import client from '../../../main';

const prefix = `# Setup Configuration\n\n`;
const suffix = `\n** **`;

export async function setupCommandSetupRoles(
  guildMember: GuildMember,
  interaction?: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('setup-command_roles')
      .setPlaceholder('Select roles')
      .setMinValues(1)
      .setMaxValues(
        client.guilds.cache.get(guildMember.guildId).roles.cache.size,
      )
      .addOptions(
        client.guilds.cache
          .get(guildMember.guildId)
          .roles.cache.map((role) => ({
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
    components: ascUpdateComponents(guildMember, [row, row2]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupRoleRoles(
  guildMember: GuildMember,
  interaction?: StringSelectMenuInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupRoleRoles2,
    previousAction: setupCommandSetupRoles,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (interaction) {
    const roles = interaction.values.map((roleId) =>
      client.guilds.cache.get(guildMember.guildId).roles.cache.get(roleId),
    );
    setActiveSetupConversations(guildMember, {
      setupAdminRoles: roles,
    });
  }

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('setup-command_role-roles')
      .setPlaceholder('Select roles')
      .setMinValues(1)
      .setMaxValues(
        client.guilds.cache.get(guildMember.guildId).roles.cache.size,
      )
      .addOptions(
        client.guilds.cache
          .get(guildMember.guildId)
          .roles.cache.map((role) => ({
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
    components: ascUpdateComponents(guildMember, [row, row2]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupRoleRoles2(
  guildMember: GuildMember,
  interaction?: StringSelectMenuInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupAnnouncementChannel,
    previousAction: setupCommandSetupRoleRoles,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (interaction) {
    const roles = interaction.values.map((roleId) =>
      client.guilds.cache.get(guildMember.guildId).roles.cache.get(roleId),
    );
    setActiveSetupConversations(guildMember, {
      setupGuildRoles: roles,
    });
  }

  // Send all roles to the user in dropdown
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('setup-command_role-roles2')
      .setPlaceholder('Select roles')
      .setMinValues(1)
      .setMaxValues(
        client.guilds.cache.get(guildMember.guildId).roles.cache.size,
      )
      .addOptions(
        client.guilds.cache
          .get(guildMember.guildId)
          .roles.cache.map((role) => ({
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
    components: ascUpdateComponents(guildMember, [row, row2]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupAnnouncementChannel(
  guildMember: GuildMember,
  interaction?: StringSelectMenuInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupServerRulesChannel,
    previousAction: setupCommandSetupRoleRoles2,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (interaction) {
    const roles = interaction.values.map((roleId) =>
      client.guilds.cache.get(guildMember.guildId).roles.cache.get(roleId),
    );
    setActiveSetupConversations(guildMember, {
      setupPugRoles: roles,
    });
  }

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
    components: ascUpdateComponents(guildMember, [row, row2]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupServerRulesChannel(
  guildMember: GuildMember,
  interaction?: ChannelSelectMenuInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupRaidRulesChannel,
    previousAction: setupCommandSetupAnnouncementChannel,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (interaction) {
    const channel = client.guilds.cache
      .get(guildMember.guildId)
      .channels.cache.get(interaction.values[0]);
    setActiveSetupConversations(guildMember, {
      setupAnnouncementChannel: channel,
    });
  }
  if (!asc.setupGuildRules)
    return setupCommandSetupRaidRulesChannel(guildMember, interaction);

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
    components: ascUpdateComponents(guildMember, [row, row2]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupRaidRulesChannel(
  guildMember: GuildMember,
  interaction?: ChannelSelectMenuInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupMessageGuildInvite,
    previousAction: setupCommandSetupServerRulesChannel,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (interaction) {
    const channel = client.guilds.cache
      .get(guildMember.guildId)
      .channels.cache.get(interaction.values[0]);
    setActiveSetupConversations(guildMember, {
      setupServerRulesChannel: channel,
    });
  }

  if (!asc.setupRaidRules)
    return setupCommandSetupMessageGuildInvite(guildMember, interaction);

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
    components: ascUpdateComponents(guildMember, [row, row2]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupMessageGuildInvite(
  guildMember: GuildMember,
  interaction?: ChannelSelectMenuInteraction,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupMessagePugInviteStay,
    previousAction: setupCommandSetupRaidRulesChannel,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (interaction) {
    const channel = client.guilds.cache
      .get(guildMember.guildId)
      .channels.cache.get(interaction.values[0]);
    setActiveSetupConversations(guildMember, {
      setupRaidRulesChannel: channel,
    });
  }

  requestAwaitingMessage(guildMember, 'setup-command_message-guild-invite');

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Set up different welcome messages: (send in chat)\n-  For Guild Invitees' +
      suffix,
    components: ascUpdateComponents(guildMember, [row]),
  });

  // Defer update
  await interaction?.deferUpdate();
}

export async function setupCommandSetupMessagePugInviteStay(
  guildMember: GuildMember,
  message?: Message,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupMessagePugInviteLeave,
    previousAction: setupCommandSetupMessageGuildInvite,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (message) {
    setActiveSetupConversations(guildMember, {
      setupGuildInviteMessage: message.content,
    });

    await message.delete();
  }
  requestAwaitingMessage(guildMember, 'setup-command_message-pug-invite-stay');

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Set up different welcome messages: (send in chat)\n-  For Pug Invitees (who stay)' +
      suffix,
    components: ascUpdateComponents(guildMember, [row]),
  });
}

export async function setupCommandSetupMessagePugInviteLeave(
  guildMember: GuildMember,
  message?: Message,
) {
  // Set next and previous actions
  setActiveSetupConversations(guildMember, {
    nextAction: setupCommandSetupFinish,
    previousAction: setupCommandSetupMessagePugInviteStay,
  });

  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (message) {
    setActiveSetupConversations(guildMember, {
      setupPugInviteMessageStay: message.content,
    });

    await message.delete();
  }
  requestAwaitingMessage(guildMember, 'setup-command_message-pug-invite-leave');

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setupCommandGetValidationNo(true),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) +
      prefix +
      'Set up different welcome messages: (send in chat)\n-  For Pug Invitees (who leave)' +
      suffix,
    components: ascUpdateComponents(guildMember, [row]),
  });
}

export async function setupCommandSetupFinish(
  guildMember: GuildMember,
  message?: Message,
) {
  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  if (message) {
    setActiveSetupConversations(guildMember, {
      setupPugInviteMessageLeave: message.content,
      setupCompleted: true,
    });

    await message.delete();
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_save')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('setup-command_restart')
      .setLabel('No, Restart')
      .setStyle(ButtonStyle.Danger),
  );

  await commandInteraction.editReply({
    content:
      getStatus(asc) + prefix + 'Is the information above correct?' + suffix,
    components: [row],
  });
}
