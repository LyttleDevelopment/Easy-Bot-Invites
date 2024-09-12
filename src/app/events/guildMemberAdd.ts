import { GuildMember } from 'discord.js';
import { GuildMember as ClientGuildMember } from '../../types';
import { onGuildMemberAdd } from '../actions';

// Emitted whenever a user subscribes to a guild scheduled event
async function guildMemberAdd(member: GuildMember): Promise<void> {
  // Ignore bots
  if (member?.user?.bot) return;

  // Create a guildMember object
  const guildMember: ClientGuildMember = {
    guildId: member?.guild?.id,
    userId: member?.id,
  };

  // Check if we have a valid guildMember
  if (!guildMember?.guildId || !guildMember?.userId) return;

  // const guildEnabled = await checkGuildEnabled(guildMember);
  // if (!guildEnabled) return;

  // Fire actions
  await onGuildMemberAdd(guildMember, member);
}

export default guildMemberAdd;
