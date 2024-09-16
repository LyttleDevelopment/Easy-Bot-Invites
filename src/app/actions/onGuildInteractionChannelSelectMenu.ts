import { ChannelSelectMenuInteraction } from 'discord.js';
import { GuildMember } from '../../types';
import { executor } from '../../utils';
import { routeChannelSelectMenuPress } from '../../modules/interactions/channel-select-menu'; // This file's prefix

// The execute function
export async function onGuildInteractionChannelSelectMenu(
  guildMember: GuildMember,
  interaction: ChannelSelectMenuInteraction,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(routeChannelSelectMenuPress, guildMember, interaction),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
