import { Client } from 'discord.js';
import { onClientReady } from '../actions/onClientReady';

export let isReady: boolean = false;

// Emitted when the client becomes ready to start working.
async function ready(client: Client): Promise<void> {
  // Set ready state
  isReady = true;

  // Fire actions
  await onClientReady(client);
}

export default ready;
