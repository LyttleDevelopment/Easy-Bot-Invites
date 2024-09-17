import { type Message } from 'discord.js';
import { getGuildMemberKey, GuildMember } from '../../../types';
import { messageRoutes } from './routes';

export const usersAwaitingMessage = new Map<string, string>();

export function requestAwaitingMessage(
  guildMember: GuildMember,
  customId: string,
): void {
  if (usersAwaitingMessage.has(getGuildMemberKey(guildMember))) {
    usersAwaitingMessage.delete(getGuildMemberKey(guildMember));
  }
  usersAwaitingMessage.set(getGuildMemberKey(guildMember), customId);
}

/**
 * Route message presses
 * @param guildMember
 * @param message
 */
export async function routeMessage(
  guildMember: GuildMember,
  message: Message,
): Promise<void> {
  // Check if the users is awaiting a message
  if (usersAwaitingMessage.has(getGuildMemberKey(guildMember))) {
    const customId = usersAwaitingMessage.get(getGuildMemberKey(guildMember));
    if (customId) {
      // Execute the route
      usersAwaitingMessage.delete(getGuildMemberKey(guildMember));
      return messageRoutes[customId](guildMember, message);
    }
  }
}
