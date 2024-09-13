import { CommandInteraction } from 'discord.js';
import { commandRoutes } from './routes';
import { GuildMember } from '../../../types';

// Get all available routes
export const registeredCommandInteractions: string[] =
  Object.keys(commandRoutes);

/**
 * Route button presses
 * @param guildMember
 * @param interaction
 */
export async function routeCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
): Promise<void> {
  // Check if the route is available
  if (!registeredCommandInteractions.includes(interaction.commandName)) {
    // Todo: Send error message
    return;
  }

  // Execute the route
  return commandRoutes[interaction.commandName](guildMember, interaction);
}
