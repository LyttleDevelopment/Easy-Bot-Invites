import { GuildMember } from '../../../types';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  CommandInteraction,
  GuildBasedChannel,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import { setupCommandValidation1 } from './questions_1_validation';
import { sleep } from '../../../utils/sleep';

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
interface ActiveSetupConversation {
  interaction: CommandInteraction;
  setupRole?: boolean;
  setupChannel?: boolean;
  setupRaidRules?: boolean;
  setupGuildRules?: boolean;
  setupAdminRoles?: Role[];
  setupGuildRoles?: Role[];
  setupPugRoles?: Role[];
  setupAnnouncementChannel?: GuildBasedChannel;
  setupServerRulesChannel?: GuildBasedChannel;
  setupRaidRulesChannel?: GuildBasedChannel;
  setupGuildInviteMessage?: string;
  setupPugInviteMessageStay?: string;
  setupRaidInviteMessageLeave?: string;
}

export const activeSetupConversations = new Map<
  string,
  ActiveSetupConversation
>();

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

  // Add user to activeSetupConversations
  activeSetupConversations.set(interaction.user.id, { interaction });

  return setupCommandValidation1(guildMember, interaction);
}

export async function sendOk(interaction: CommandInteraction) {
  const currentMessage = await interaction.fetchReply();

  // Add thumps up emoji to end of first line (currentMessage has many lines)
  const content = currentMessage.content.split('\n');
  content[0] += ' 👍';

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_ok')
      .setLabel('Loading...')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
  );

  await interaction.editReply({
    content: content.join('\n'),
    components: [row],
  });

  await sleep(100);
}

export function getStatus(asc: ActiveSetupConversation) {
  asc = activeSetupConversations.get(asc.interaction.user.id);
  const status = [];

  if (asc.setupAdminRoles || asc.setupGuildRoles || asc.setupPugRoles) {
    status.push(
      `### Roles\n${
        asc.setupAdminRoles ? `- Admin Roles: ${asc.setupAdminRoles}\n` : ''
      }${asc.setupGuildRoles ? `- Guild Roles: ${asc.setupGuildRoles}\n` : ''}${
        asc.setupPugRoles ? `- Pug Roles: ${asc.setupPugRoles}\n` : ''
      }`,
    );
  }
  if (
    asc.setupAnnouncementChannel ||
    asc.setupServerRulesChannel ||
    asc.setupRaidRulesChannel
  ) {
    status.push(
      `### Channels\n${
        asc.setupAnnouncementChannel
          ? `- Announcement Channel: ${asc.setupAnnouncementChannel}\n`
          : ''
      }${
        asc.setupServerRulesChannel
          ? `- Server Rules Channel: ${asc.setupServerRulesChannel}\n`
          : ''
      }${
        asc.setupRaidRulesChannel
          ? `- Raid Rules Channel: ${asc.setupRaidRulesChannel}\n`
          : ''
      }`,
    );
  }

  if (
    asc.setupGuildInviteMessage ||
    asc.setupPugInviteMessageStay ||
    asc.setupRaidInviteMessageLeave
  ) {
    status.push(
      `### Messages${
        asc.setupGuildInviteMessage
          ? `- Guild Invite Message: \n\`\`\`${asc.setupGuildInviteMessage}\`\`\`\n`
          : ''
      }${
        asc.setupPugInviteMessageStay
          ? `- Pug Invite Message (Stay): \n\`\`\`${asc.setupPugInviteMessageStay}\`\`\`\n`
          : ''
      }${
        asc.setupRaidInviteMessageLeave
          ? `- Raid Invite Message (Leave): \n\`\`\`${asc.setupRaidInviteMessageLeave}\`\`\`\n`
          : ''
      }`,
    );
  }

  if (status.length < 1) return '';
  return `## Setup Status:\n\n${status.join('\n')}\n`;
}
