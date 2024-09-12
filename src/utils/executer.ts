import { log } from './';
import { LogType } from '../types';

/**
 * The main module executor, it prevents the bot from hard crashing.
 * @param moduleName
 * @param moduleFunction
 * @param args
 */
export async function executor(
  moduleFunction: ((...args) => Promise<() => void>) | ((...args) => void),
  ...args: unknown[]
) {
  let result = null;

  try {
    // Execute the module
    if (args.length === 0) {
      // If no arguments are given, execute the module without arguments
      result = await moduleFunction();
    } else {
      // If arguments are given, execute the module with arguments
      result = await moduleFunction(...args);
    }
  } catch (error) {
    // Log the error
    log(LogType.ERROR, error);
  }

  // Return the result
  return result;
}
