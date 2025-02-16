import {
  exportListCommandData,
  inviteCommandData,
  listAllCommandData,
  listClassCommandData,
  listSpecCommandData,
  purgeCommandData,
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
  purgeCommandData,
  setCharacterCommandData,
  setupCommandData,
] as const;
