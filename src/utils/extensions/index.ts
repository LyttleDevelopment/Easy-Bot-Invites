import createObjectExtensions from './object';
import createStringExtensions from './string';
import createBooleanExtensions from './boolean';
import createArrayExtensions from './array';

export function createExtensions(): void {
  createObjectExtensions();
  createStringExtensions();
  createBooleanExtensions();
  createArrayExtensions();
}
