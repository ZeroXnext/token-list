import fs from 'node:fs';
import {TokenList} from '@tokenlist-builder/core';
import path from 'node:path';
import {ListPath, SeenKey} from '@types';
import {CHAINS_MAPPING} from '@constants';
import getPaths from './get-paths';

export default function load(outputDir: string): [Map<ListPath, TokenList>, Set<SeenKey>] {
  const paths = getPaths(outputDir);
  const seen = new Set<SeenKey>();
  return [new Map<ListPath, TokenList>(paths.map(key => {
    const listKey = path.join(outputDir, key.toString()) as ListPath;
    const list = JSON.parse(fs.readFileSync(listKey, 'utf-8')) as TokenList;
    for (let {address, chainId} of list.tokens) {
      const {name, type} = CHAINS_MAPPING[chainId];
      seen.add(`${type}:${name}:${address}`);
    }
    return [path.join(outputDir, key.toString()) as ListPath, list as TokenList];
  })), seen];
}
