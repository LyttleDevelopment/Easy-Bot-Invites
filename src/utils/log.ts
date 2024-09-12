import { LogType } from '../types';

export function log(type: LogType, ...messages) {
  console[type](...messages);
}
