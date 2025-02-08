import {
  exportListCommandData,
  inviteCommandData,
  listAllCommandData,
  listClassCommandData,
  listSpecCommandData,
  setCharacterCommandData,
  setupCommandData,
} from '../../commands';

/**
 * All registered commands DATA
 * !! Not typed, so we can detect the command name !!
 */
export const commands = [
  exportListCommandData,
  inviteCommandData,
  listAllCommandData,
  listClassCommandData,
  listSpecCommandData,
  setCharacterCommandData,
  setupCommandData,
] as const;
