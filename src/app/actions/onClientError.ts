import { actionPrefix } from './';

// This file's prefix
const prefix: string = actionPrefix + 'onClientError.';

// The execute function
export async function onClientError(error: Error): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    // executor(prefix + 'test', test, error),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
