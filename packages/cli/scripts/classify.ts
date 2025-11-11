import {TokenList} from "@tokenlist-builder/core";
import {MappedChainsType} from '../types';
import {CHAINS_MAPPING} from '../constants';
import {createDefaultList} from '../utils';

function main(tokenLists: TokenList[], supportedChains: string[], supportedNetworks: string[], verbose: boolean): MappedChainsType {
  const listMapping: MappedChainsType = new Map();
  const seen = new Set<string>();

  for (const tokenList of tokenLists) {
    for (const token of tokenList.tokens) {
      const chainInfo = CHAINS_MAPPING[token.chainId];
      if (!chainInfo || !supportedChains.includes(chainInfo.name) || !supportedNetworks.includes(chainInfo.type)) continue; // skip unknown chains or unknown network types
      const {name, type} = chainInfo;

      const uniqueKey = `${token.chainId}:${token.address.toLowerCase()}`;

      // Skip if token was already added
      if (seen.has(uniqueKey)) {
        if (verbose) {
          console.info(`Skipping ${token.address} from ${name}`);
        }
        continue;
      }
      seen.add(uniqueKey);

      // Get or create the map for this chain type
      let typeMap = listMapping.get(type);
      if (!typeMap) {
        typeMap = new Map<string, TokenList>();
        listMapping.set(type, typeMap);
      }

      // Get or create the TokenList for this chain name
      let mappedChain = typeMap.get(name);
      if (!mappedChain) {
        mappedChain = createDefaultList(name);
        typeMap.set(name, mappedChain);
      }
      if (verbose) {
        console.info(`Adding ${token.name} to ${name} ${mappedChain.tokens.length}`);
      }

      // Push token (mutates the TokenList object directly)
      mappedChain.tokens.push(token);
    }
  }

  return listMapping;
}

export default main;
