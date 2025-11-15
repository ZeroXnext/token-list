import fs from 'node:fs';
import {TokenList} from '@tokenlist-builder/core';
import path from 'node:path';

export default function loadFlatLocal(outputDir: string): Map<string, TokenList> {
  const [, , ...paths] = fs.readdirSync(outputDir, {recursive: true});
  return new Map<string, TokenList>(paths.map(key => [path.join(outputDir, key.toString()), JSON.parse(fs.readFileSync(path.join(outputDir, key.toString()), 'utf-8')) as TokenList]));
}
