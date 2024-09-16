import { StringSelectMenuInteraction } from 'discord.js';
import { GuildMember } from '../../../types';
import { stringSelectMenuRoutes } from './routes';

// Get all available routes
export const registeredSelectMenuInteractions: string[] = Object.keys(
  stringSelectMenuRoutes,
);

/**
 * Route selectMenu presses
 * @param guildMember
 * @param interaction
 */
export async function routeSelectMenuPress(
  guildMember: GuildMember,
  interaction: StringSelectMenuInteraction,
): Promise<void> {
  // Check if the route is available
  if (!registeredSelectMenuInteractions.includes(interaction.customId)) {
    await interaction.deferUpdate();
    return;
  }

  // Execute the route
  return stringSelectMenuRoutes[interaction.customId](guildMember, interaction);
}
