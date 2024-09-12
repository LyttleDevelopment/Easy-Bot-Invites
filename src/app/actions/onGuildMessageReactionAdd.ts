import { actionPrefix } from './index';
import { MessageReaction, User } from 'discord.js';
import { GuildMember } from '../../types';

// This file's prefix
const prefix: string = actionPrefix + 'onGuildMessageReactionAdd.';

// The execute function
export async function onGuildMessageReactionAdd(
  guildMember: GuildMember,
  messageReaction: MessageReaction,
  user: User,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
