import { ButtonInteraction, User } from 'discord.js';
import { buttonRoutes } from './routes';

// Get all available routes
export const registeredButtonInteractions: string[] = Object.keys(buttonRoutes);

/**
 * Route button presses
 * @param user
 * @param interaction
 */
export async function routePrivateButtonPress(
  user: User,
  interaction: ButtonInteraction,
): Promise<void> {
  // Check if the route is available
  if (!registeredButtonInteractions.includes(interaction.customId)) {
    await interaction.deferUpdate();
    return;
  }

  // Execute the route
  return buttonRoutes[interaction.customId](user, interaction);
}
