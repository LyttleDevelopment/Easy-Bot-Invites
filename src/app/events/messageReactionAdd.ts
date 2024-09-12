import { MessageReaction, User } from 'discord.js';
import { GuildMember } from '../../types';
import { onGuildMessageReactionAdd } from '../actions';

// Emitted whenever a reaction is added to a cached message.
async function messageReactionAdd(
  messageReaction: MessageReaction,
  user: User,
): Promise<void> {
  // Ignore bots
  if (user?.bot) return;

  // Check if the message is a DM
  if (!messageReaction?.message?.guild) {
    // Get the user id
    const userId = user?.id;

    // Check if we have a valid user
    if (!userId) return;

    // Fire actions
    // await onPrivateMessageReactionAdd(userId, messageReaction, user);
    return;
  }

  // Build the guildMember
  const guildMember: GuildMember = {
    guildId: messageReaction?.message?.guild?.id,
    userId: user?.id,
  };

  // Check if we have a valid guildMember
  if (!guildMember?.guildId || !guildMember?.userId) return;

  // const guildEnabled = await checkGuildEnabled(guildMember);
  // if (!guildEnabled) return;

  // Fire actions
  await onGuildMessageReactionAdd(guildMember, messageReaction, user);
}

export default messageReactionAdd;
