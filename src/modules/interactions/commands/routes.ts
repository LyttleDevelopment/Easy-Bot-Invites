import {
  exportListCommand,
  inviteCommand,
  listAllCommand,
  listClassCommand,
  listSpecCommand,
  purgeCommand,
  setCharacterCommand,
  setupCommand,
} from '../../commands';
import { CommandRoutes } from './command-types';

/**
 * All routes for button presses
 * customId: Function
 */
export const commandRoutes: CommandRoutes = {
  export_list: exportListCommand,
  invite: inviteCommand,
  list_all: listAllCommand,
  list_class: listClassCommand,
  list_spec: listSpecCommand,
  purge: purgeCommand,
  set_character: setCharacterCommand,
  setup: setupCommand,
};
