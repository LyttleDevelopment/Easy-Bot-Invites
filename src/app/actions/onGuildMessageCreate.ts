import { GuildMember } from '../../types';
import { executor } from '../../utils';
import { Message } from 'discord.js';
import { routeMessage } from '../../modules/interactions/message';

export async function onGuildMessageCreate(
  guildMember: GuildMember,
  message: Message,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(routeMessage, guildMember, message),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
