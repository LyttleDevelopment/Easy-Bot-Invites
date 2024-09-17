import { getGuildMemberKey, GuildMember } from '../../../types';
import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
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
export interface ActiveSetupConversation
  extends ActiveSetupConversationSettings {
  guildMember: GuildMember;
  interaction: CommandInteraction;
}

export interface ActiveSetupConversationSettings {
  setupCompleted?: boolean;
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

  nextAction?: (guildMember: GuildMember) => Promise<void>;
  previousAction?: (guildMember: GuildMember) => Promise<void>;
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
  if (activeSetupConversations.has(getGuildMemberKey(guildMember))) {
    activeSetupConversations.delete(getGuildMemberKey(guildMember));
  }

  // Add user to activeSetupConversations
  activeSetupConversations.set(getGuildMemberKey(guildMember), {
    guildMember,
    interaction,
  });

  return setupCommandValidation1(guildMember, interaction);
}
