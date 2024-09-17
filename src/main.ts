import { environment, log } from './utils';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import * as fs from 'fs';
import { LogType } from './types';
import { createExtensions } from './utils/extensions';

createExtensions();

export const client = new Client({
  allowedMentions: { parse: [] },
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
});

log(LogType.INFO, 'Caching events...');

const eventFiles = fs
  .readdirSync('./src/app/events')
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.replace('.ts', ''));

log(LogType.INFO, `Found event files:\n - ${eventFiles.join('\n - ')}`);
log(LogType.INFO, 'Loading events...');

eventFiles.forEach((file, i) => {
  import(`./app/events/${file}`)
    .then(({ default: event }) => {
      if (typeof event === 'function') {
        if (event.once) {
          client.once(eventFiles[i], event);
        } else {
          client.on(eventFiles[i], event);
        }
        log(LogType.INFO, `Loaded event ${eventFiles[i]}`);
      } else {
        log(LogType.WARN, `Event ${eventFiles[i]} is not a function/event`);
      }
    })
    .catch((err) => {
      log(LogType.ERROR, `Could not load event ${eventFiles[i]}: ${err}`);
    });
});

// Login to Discord with your client's token
client.login(environment.BOT_TOKEN).then(() => log(LogType.INFO, 'running'));

export const bootdate = new Date();

export default client;
