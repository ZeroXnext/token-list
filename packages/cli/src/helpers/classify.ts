import {TokenList, tokenListSchema} from "@tokenlist-builder/core";
import {ListPath, Mutable, SeenKey, TokenListsMap} from '@types';
import {CHAINS_MAPPING} from '@constants';
import {initializeTokenList} from '@helpers';
import {slugify} from '@utils';

export default function classify(tokenList: TokenList, supportedNetworks: string[], supportedChains: string[], rootDir: string, seen: Set<SeenKey>, version = tokenList.version, offset = -1): Map<ListPath, TokenList> {
  const mapping = new Map<ListPath, TokenList>([]);
  for (let i = Math.max(offset, 0); i < tokenList.tokens.length; i++) {

    const token = tokenList.tokens[i];
    // 1. Ignore if token doesn't have a chain id
    if (!token.chainId || !token.address) {
      continue;
    }

    const {name, type} = CHAINS_MAPPING[token.chainId];

    // 2. Check if this token has been seen
    if (seen.has(`${type}:${name}:${token.address}`)) {
      continue;
    }

    // 3. Check if network or chains are supported
    if (!supportedNetworks.includes(type) || !supportedChains.includes(name)) {
      continue;
    }

    // 4. Initialize listPath
    let listPath: ListPath = `${rootDir}/${type}/${name}/${slugify(name)}.json`;

    // 5. Check if there is an offset available, if so modify token list name and listPath
    let tokenListName: string = tokenList.name;
    if (offset > -1) {
      tokenListName = tokenList.name + ` ${offset}`
      listPath = `${rootDir}/${type}/${name}/${slugify(name)}-${offset}.json`;
    }

    let list: Mutable<TokenList> | undefined = mapping.get(listPath);

    // 3. Check if there is an existing list, otherwise initialize empty tokens
    if (!list) {
      mapping.set(listPath, initializeTokenList({
        name: tokenListName,
        tags: tokenList.tags,
        tokens: [],
        keywords: tokenList.keywords,
        logoURI: tokenList.logoURI
      }));
      list = mapping.get(listPath);
    }

    // 4. Check if the list has reached the maximum tokens, if so write another list
    const maxTokensPerList = tokenListSchema.properties.tokens.maxItems;
    if (list?.tokens.length ?? 0 > maxTokensPerList) {
      offset += 1;
      classify(tokenList, supportedNetworks, supportedChains, rootDir, seen, version, offset);
    }

    // 5. Push token its path
    list?.tokens.push(token);
  }

  return mapping;
}

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
