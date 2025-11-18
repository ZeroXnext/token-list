import fs from 'node:fs';
import {Chain, Config, ListPath, SeenKey, TokenList} from '@tokenlist-builder/core';
import path from 'node:path';
import getPaths from './get-paths';

export default function load(config: Config): [Map<ListPath, TokenList>, Set<SeenKey>] {
  const paths = getPaths(config.outputDir, config.indexFileName);
  const seen = new Set<SeenKey>();
  return [new Map<ListPath, TokenList>(paths.map(key => {
    const listKey = path.join(config.outputDir, key.toString()) as ListPath;
    const list = JSON.parse(fs.readFileSync(listKey, 'utf-8')) as TokenList;
    for (let {address, chainId} of list.tokens) {
      const {name, type} = config.chainsMapping?.get(chainId) as Chain;
      seen.add(`${type}:${name}:${address}`);
    }
    return [path.join(config.outputDir, key.toString()) as ListPath, list as TokenList];
  })), seen];
}
