import fs from 'node:fs';
import {TokenList} from '@tokenlist-builder/core';
import path from 'node:path';
import {SeenKey} from '@types';
import {CHAINS_MAPPING} from '@constants';
import getPaths from './get-paths';

export default function load(outputDir: string): [Map<string, TokenList>, Set<SeenKey>] {
  const paths = getPaths(outputDir);
  const seen = new Set<SeenKey>();
  return [new Map<string, TokenList>(paths.map(key => {
    const list = JSON.parse(fs.readFileSync(path.join(outputDir, key.toString()), 'utf-8')) as TokenList;
    for (let {address, chainId} of list.tokens) {
      const {name, type} = CHAINS_MAPPING[chainId];
      seen.add(`${type}:${name}:${address}`);
    }
    return [path.join(outputDir, key.toString()), list];
  })), seen];
}
