import { ChannelSelectMenuInteraction } from 'discord.js';
import { GuildMember } from '../../../types';
import { channelSelectMenuRoutes } from './routes';

// Get all available routes
export const registeredSelectMenuInteractions: string[] = Object.keys(
  channelSelectMenuRoutes,
);

/**
 * Route selectMenu presses
 * @param guildMember
 * @param interaction
 */
export async function routeChannelSelectMenuPress(
  guildMember: GuildMember,
  interaction: ChannelSelectMenuInteraction,
): Promise<void> {
  // Check if the route is available
  if (!registeredSelectMenuInteractions.includes(interaction.customId)) {
    await interaction.deferUpdate();
    return;
  }

  // Execute the route
  return channelSelectMenuRoutes[interaction.customId](
    guildMember,
    interaction,
  );
}
