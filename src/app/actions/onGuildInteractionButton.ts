import { actionPrefix } from './index';
import { ButtonInteraction } from 'discord.js';
import { GuildMember } from '../../types';

// This file's prefix
const prefix: string = actionPrefix + 'onGuildInteractionButton.';

// The execute function
export async function onGuildInteractionButton(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
