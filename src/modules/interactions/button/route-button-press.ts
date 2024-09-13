import { ButtonInteraction } from 'discord.js';
import { buttonRoutes } from './routes';
import { GuildMember } from '../../../types';

// Get all available routes
export const registeredButtonInteractions: string[] = Object.keys(buttonRoutes);

/**
 * Route button presses
 * @param guildMember
 * @param interaction
 */
export async function routeButtonPress(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
): Promise<void> {
  // Check if the route is available
  if (!registeredButtonInteractions.includes(interaction.customId)) {
    await interaction.deferUpdate();
    return;
  }

  // Execute the route
  return buttonRoutes[interaction.customId](guildMember, interaction);
}
