import * as path from 'node:path';
import * as fs from 'node:fs';

export function loadJson(fileName: string): { [key: string]: string } {
  const filePath = path.resolve(__dirname, '../../config', `${fileName}.json`);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}
