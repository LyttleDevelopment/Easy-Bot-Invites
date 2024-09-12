import { actionPrefix } from './index';
import { ModalSubmitInteraction } from 'discord.js';
import { GuildMember } from '../../types';

// This file's prefix
const prefix: string = actionPrefix + 'onGuildInteractionModalSubmit.';

// The execute function
export async function onGuildInteractionModalSubmit(
  guildMember: GuildMember,
  interaction: ModalSubmitInteraction,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
