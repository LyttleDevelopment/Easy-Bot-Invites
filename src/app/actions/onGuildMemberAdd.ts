import { GuildMember } from 'discord.js';
import { GuildMember as ClientGuildMember } from '../../types';
import { onMemberAdd } from '../../modules/invite/invite';
import { executor } from '../../utils';

// The execute function
export async function onGuildMemberAdd(
  guildMember: ClientGuildMember,
  member: GuildMember,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(onMemberAdd, guildMember, member),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
