import {TokenList, tokenListSchema} from "@tokenlist-builder/core";
import {TokenListsMap} from '@types';
import {CHAINS_MAPPING} from '@constants';
import {initializeTokenList} from '@helpers';
import {slugify} from '@utils';

function main(tokenLists: TokenList[], supportedChains: string[], supportedNetworks: string[], initialMap: TokenListsMap = new Map(), initialSeen = new Set<string>(), verbose: boolean): TokenListsMap {
  // [network_type]/[chain_name]/[file_key]/[actual_list]
  const mappedTokenList: TokenListsMap = initialMap;
  const seen = initialSeen;


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
      let networkTypeMap = mappedTokenList.get(type);
      if (!networkTypeMap) {
        networkTypeMap = new Map<string, Map<string, TokenList>>();
        mappedTokenList.set(type, networkTypeMap);
      }

      // Get or create the TokenList for this chain name
      let mappedChain = networkTypeMap.get(name);
      if (!mappedChain) {
        mappedChain = new Map<string, TokenList>();
        networkTypeMap.set(name, mappedChain);
      }


      let listKey = slugify(tokenList.name);
      let _mappedTokenLists = mappedChain.get(slugify(tokenList.name));
      if (!_mappedTokenLists) {
        const initialized = initializeTokenList({
          name: tokenList.name,
          tags: tokenList.tags,
          tokens: [],
          keywords: tokenList.keywords,
          logoURI: tokenList.logoURI
        });
        mappedChain.set(listKey, initialized);
        _mappedTokenLists = mappedChain.get(listKey) as TokenList;
      } else if (_mappedTokenLists.tokens.length === tokenListSchema.properties.tokens.maxItems) {
        let i = 1;
        while (mappedChain.has(listKey)) {
          listKey = `${listKey}-${i}`;
        }
        const initialized = initializeTokenList({
          name: tokenList.name,
          tags: tokenList.tags,
          tokens: [],
          keywords: tokenList.keywords,
          logoURI: tokenList.logoURI
        });

        mappedChain.set(listKey, initialized);
        _mappedTokenLists = initialized;
      }

      if (verbose) {
        console.info(`Adding ${token.name} to ${name} ${_mappedTokenLists.tokens.length}`);
      }

      // Push token (mutates the TokenList object directly)
      _mappedTokenLists.tokens.push(token);
    }
  }

  return mappedTokenList;
}

export default main;
