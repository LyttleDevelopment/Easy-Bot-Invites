import { Message } from 'discord.js';
import { GuildMember } from '../../../types';
import {
  setupCommandSetupFinish,
  setupCommandSetupMessagePugInviteLeave,
  setupCommandSetupMessagePugInviteStay,
} from '../../commands/setup/questions_2_setup';

/**
 * All routes for button presses
 * customId: Function
 */
export const messageRoutes: MessageRoutes = {
  'setup-command_message-guild-invite': setupCommandSetupMessagePugInviteStay,
  'setup-command_message-pug-invite-stay':
    setupCommandSetupMessagePugInviteLeave,
  'setup-command_message-pug-invite-leave': setupCommandSetupFinish,
};

/**
 * All routes/functions for button presses interface
 */
export interface MessageRoutes {
  [key: string]: (guildMember: GuildMember, message: Message) => void;
}
