import { actionPrefix } from './index';
import { ButtonInteraction, User } from 'discord.js';
import { executor } from '../../utils';
import { routePrivateButtonPress } from '../../modules/interactions/button-private'; // This file's prefix

// This file's prefix
const prefix: string = actionPrefix + 'onPrivateInteractionButton.';

// The execute function
export async function onPrivateInteractionButton(
  user: User,
  interaction: ButtonInteraction,
): Promise<void> {
  // All actions that should be executed
  const actions: Promise<() => void>[] = [
    executor(routePrivateButtonPress, user, interaction),
  ];

  // If no actions, return
  if (actions.length < 1) return;

  // Execute all actions
  await Promise.all(actions);
}
