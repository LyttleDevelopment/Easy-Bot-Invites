import { Client } from 'discord.js';
import { deployCommands } from '../../utils/deploy-commands';
import { executor } from '../../utils';

// The execute function
export async function onClientReady(client: Client): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [executor(deployCommands)];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
