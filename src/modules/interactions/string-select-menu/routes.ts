import { GuildMember } from '../../../types';
import {
  setupCommandSetupAnnouncementChannel,
  setupCommandSetupRoleRoles,
  setupCommandSetupRoleRoles2,
} from '../../commands/setup/questions_2_setup';
import { StringSelectMenuInteraction } from 'discord.js';

/**
 * All routes for selectMenu presses
 * customId: Function
 */
export const stringSelectMenuRoutes: StringSelectMenuRoutes = {
  'setup-command_roles': setupCommandSetupRoleRoles,
  'setup-command_role-roles': setupCommandSetupRoleRoles2,
  'setup-command_role-roles2': setupCommandSetupAnnouncementChannel,
};

/**
 * All routes/functions for selectMenu presses interface
 */
export interface StringSelectMenuRoutes {
  [key: string]: (
    guildMember: GuildMember,
    interaction: StringSelectMenuInteraction,
  ) => void;
}
