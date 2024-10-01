import { Client } from 'discord.js';
import { deployCommands } from '../../utils/deploy-commands';
import { executor } from '../../utils';
import { initInviteCache } from '../../modules/invite/check-invite';
import { startInterval } from '../../modules/interval/interval';

// The execute function
export async function onClientReady(client: Client): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(deployCommands),
    executor(initInviteCache),
    executor(startInterval),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
