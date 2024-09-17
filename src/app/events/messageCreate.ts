import type { Message } from 'discord.js';
import { GuildMember } from '../../types';
import { onPrivateMessageCreate } from '../actions/onPrivateMessageCreate';
import { onGuildMessageCreate } from '../actions/onGuildMessageCreate';

async function messageCreate(message: Message): Promise<void> {
  // If the message is from a bot, ignore it
  if (message?.author?.bot) return;

  // Check if the message is a DM
  if (!message?.guild) {
    const userId = message?.author?.id;
    // Check if we have a valid user
    if (!userId) return;

    // Fire actions
    await onPrivateMessageCreate(userId, message);
    return;
  }

  // Build the guildMember
  const guildMember: GuildMember = {
    userId: message?.author?.id,
    guildId: message?.guild?.id,
  };

  // Check if we have a valid guildMember
  if (!guildMember.guildId || !guildMember.userId) return;

  // Fire actions
  await onGuildMessageCreate(guildMember, message);
}

export default messageCreate;
