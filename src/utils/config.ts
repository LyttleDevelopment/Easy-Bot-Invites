// import * as fs from 'fs';
// import { log } from './';
// import { ALLOWED_ERROR_COUNT } from '../../constants';
// import { LogType } from '../types';
//
// /**
//  * The main module executor, it prevents the bot from hard crashing.
//  * @param moduleName
//  * @param moduleFunction
//  * @param args
//  */
// export async function executor(
//   moduleName: string,
//   moduleFunction: ((...args) => Promise<() => void>) | ((...args) => void),
//   ...args: unknown[]
// ) {
//   let result = null;
//
//   // Check if the module may be executed
//   if (!mayExecute(moduleName)) return result;
//
//   // Try to execute the module
//   try {
//     // Execute the module
//     if (args.length === 0) {
//       // If no arguments are given, execute the module without arguments
//       result = await moduleFunction();
//     } else {
//       // If arguments are given, execute the module with arguments
//       result = await moduleFunction(...args);
//     }
//   } catch (error) {
//     // If the module fails, increase the error count
//     setModule(moduleName, 1);
//
//     // Log the error
//     log(LogType.ERROR, error);
//   }
//
//   // Return the result
//   return result;
// }
//
// // The path to the modules.json file
// const modulesPath: string = process.cwd() + '\\modules.json';
// // Cached modules
//
// export interface ExecutorModules {
//   [key: string]: {
//     enabled: boolean;
//     errors: number;
//   };
// }
// export let executorModules: ExecutorModules = {};
//
// // Check if a module may be executed
// function mayExecute(moduleName: string): boolean {
//   // Try to get the module status.
//   try {
//     // Get enabled state
//     const enabled = executorModules[moduleName].enabled === true;
//
//     // Check if the module has too many errors
//     const tooManyErrors =
//       executorModules[moduleName].errors >= ALLOWED_ERROR_COUNT;
//
//     // Check if the module is enabled and not disabled
//     return enabled && !tooManyErrors;
//   } catch (error) {
//     // If not found, create it.
//     setModule(moduleName);
//
//     // Retry the function
//     return mayExecute(moduleName);
//   }
// }
//
// // Set a module's status, storaged & cached
// function setModule(moduleName: string, errors = 0): void {
//   try {
//     // Read the modules.json file otherwise keep the cached version
//     try {
//       const file = fs.readFileSync(modulesPath, 'utf8');
//       executorModules = JSON.parse(file);
//     } catch (error) {
//       // If the file could not be read, log the error
//       log(LogType.ERROR, error);
//     }
//
//     // Set the module's status
//     try {
//       // If the module exists, add the errors
//       executorModules[moduleName].errors += errors;
//     } catch (error) {
//       // / If the module does not exist, create it
//       executorModules[moduleName] = { enabled: true, errors };
//     }
//
//     // Disable the module if it has too many errors
//     if (executorModules[moduleName].errors >= ALLOWED_ERROR_COUNT) {
//       // Disable the module
//       executorModules[moduleName].enabled = false;
//     }
//
//     // Write the modules.json file
//     fs.writeFileSync(modulesPath, JSON.stringify(executorModules, null, 2));
//   } catch (error) {
//     // If the module could not be set, log the error
//     log(LogType.ERROR, error);
//   }
// }
