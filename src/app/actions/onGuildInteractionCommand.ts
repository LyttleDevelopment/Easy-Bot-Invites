import { executor } from '../../utils';
import { actionPrefix } from './index';
import { CommandInteraction } from 'discord.js';
import { GuildMember } from '../../types';
import { routeCommand } from '../../modules/interactions/commands/route-command';

// This file's prefix
const prefix: string = actionPrefix + 'onGuildInteractionCommand.';

// The execute function
export async function onGuildInteractionCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(routeCommand, guildMember, interaction),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
