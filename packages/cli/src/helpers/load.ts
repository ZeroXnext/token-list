import {TokenList} from "@tokenlist-builder/core";
import * as fs from 'node:fs';
import {TokenListsMap} from '@types';
import path from 'node:path';

function main(outputDir: string): [TokenListsMap, Set<string>] {
  const mapped: TokenListsMap = new Map();
  const seen = new Set<string>();
  // Read all chain types (e.g., 'evm', 'solana', etc.)
  const [, , ...lists] = fs.readdirSync(outputDir, {recursive: true}).map(item => item.toString().split("/"));
  for (const [chainType, chainName, listKey] of lists) {
    const tokenListMap: Map<string, TokenList> = mapped.get(chainType)?.get(chainName) ?? new Map();

    const tokenList = JSON.parse(fs.readFileSync(path.join(outputDir, chainType, chainName, listKey), 'utf-8')) as TokenList;
    for (let {address, chainId} of tokenList.tokens) {
      seen.add(`${chainId}:${address.toLowerCase()}`);
    }
    const [key] = listKey.split('.');
    tokenListMap.set(key, tokenList);

    const chainMapType: Map<string, typeof tokenListMap> = new Map();
    chainMapType.set(chainName, tokenListMap);

    mapped.set(chainType, chainMapType);
  }

  return [mapped, seen];
}

export default main;
