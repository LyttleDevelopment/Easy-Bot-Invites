import { GuildMember } from '../../../types';
import {
  setupCommandSetupMessageGuildInvite,
  setupCommandSetupRaidRulesChannel,
  setupCommandSetupServerRulesChannel,
} from '../../commands/setup/questions_2_setup';
import { ChannelSelectMenuInteraction } from 'discord.js';

/**
 * All routes for selectMenu presses
 * customId: Function
 */
export const channelSelectMenuRoutes: ChannelSelectMenuRoutes = {
  'setup-command_announcement-channel': setupCommandSetupServerRulesChannel,
  'setup-command_server-rules-channel': setupCommandSetupRaidRulesChannel,
  'setup-command_raid-rules-channel': setupCommandSetupMessageGuildInvite,
};

/**
 * All routes/functions for selectMenu presses interface
 */
export interface ChannelSelectMenuRoutes {
  [key: string]: (
    guildMember: GuildMember,
    interaction: ChannelSelectMenuInteraction,
  ) => void;
}
