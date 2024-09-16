import { actionPrefix } from './index';
import { StringSelectMenuInteraction } from 'discord.js';
import { GuildMember } from '../../types';
import { routeSelectMenuPress } from '../../modules/interactions/string-select-menu';
import { executor } from '../../utils'; // This file's prefix

// This file's prefix
const prefix: string = actionPrefix + 'onGuildInteractionModalSubmit.';

// The execute function
export async function onGuildInteractionStringSelectMenu(
  guildMember: GuildMember,
  interaction: StringSelectMenuInteraction,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(routeSelectMenuPress, guildMember, interaction),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
