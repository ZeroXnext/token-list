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
