import process from 'process';
import { REST, Routes } from 'discord.js';
import { environment } from './environment';
import { log } from './log';
import { LogType } from '../types';
import { commands } from '../modules/commands/handler/commands';

export async function deployCommands(): Promise<void> {
  // Only deploy if --deploy-commands is passed
  if (process.argv.includes('--deploy-commands')) {
    const discordCommands = [...commands].map((command) => command.commandData);

    // Get the rest client
    const rest = new REST({ version: '10' }).setToken(environment.BOT_TOKEN);

    try {
      // Log state
      log(LogType.INFO, 'Deploying commands...');

      // Deploy commands
      await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
        body: discordCommands,
      });

      // Log state
      log(LogType.INFO, 'Commands deployed!');
    } catch (error) {
      // Log state
      log(LogType.ERROR, 'Failed to deploy commands!\n', error);
    }

    // Exit the process
    process.exit();
  }
}
