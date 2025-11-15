import fs from 'node:fs';
import {TokenList} from '@tokenlist-builder/core';

export default function loadFlatLocal(outputDir: string): Map<string, TokenList> {
  const [, , ...paths] = fs.readdirSync(outputDir, {recursive: true});
  return new Map<string, TokenList>(paths.map(key => [key.toString(), JSON.parse(fs.readFileSync(key, 'utf-8')) as TokenList]));
}
