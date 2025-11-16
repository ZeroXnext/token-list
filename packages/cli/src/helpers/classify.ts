import {slugify, TokenList, tokenListSchema, Mutable} from "@tokenlist-builder/core";
import {Chain, ListPath, SeenKey} from '@types';
import {CHAINS_MAPPING, DEFAULT_TOKEN_LIST_NAME} from '@constants';
import createList from './create-list';
const mapping = new Map<ListPath, TokenList>([]);

export default function classify(tokenList: TokenList, supportedNetworks: string[], rootDir: string, seen: Set<SeenKey>, defaultVersion = tokenList.version, defaultTokenListName = DEFAULT_TOKEN_LIST_NAME, offset = -1): Map<ListPath, TokenList> {
  for (let i = Math.max(offset, 0); i < tokenList.tokens.length; i++) {

    const token = tokenList.tokens[i];
    // 1. Ignore if token is invalid
    if (!token.chainId ||
        !token.address ||
        token.logoURI === null ||
        token.name.length > tokenListSchema.definitions.TokenInfo.properties.name.maxLength ||
        token.symbol.length > tokenListSchema.definitions.TokenInfo.properties.symbol.maxLength ||
        !Object.hasOwn(token, 'decimals') ||
        !new RegExp(tokenListSchema.definitions.TokenInfo.properties.symbol.anyOf[1].pattern).test(token.symbol)
    ) {
      continue;
    }

    const chainInfo: Chain | undefined = CHAINS_MAPPING[token.chainId];
    if (!chainInfo) {
      console.info(`Unsupported chain_id: ${token.chainId}`);
      continue;
    }
    // 2. Check if this token has been seen
    if (seen.has(`${chainInfo.type}:${chainInfo.name}:${token.address}`)) {
      continue;
    }

    // 3. Check if network or chains are supported
    if (!supportedNetworks.includes(chainInfo.type)) {
      continue;
    }


    // 4. Check if there is an offset available, if so modify token list name and listPath
    let tokenListName: string = tokenList.name;

    // 5. Check and normalize list name
    if (tokenListName.length > tokenListSchema.properties.name.maxLength) {
      tokenListName = defaultTokenListName;
    }

    // 6. Initialize listPath
    let listPath: ListPath = `${rootDir}/${chainInfo.type}/${chainInfo.name}/${slugify(tokenListName)}.json`;

    const maxTokensPerList = tokenListSchema.properties.tokens.maxItems;
    if (offset > -1) {
      const off = Math.floor(offset / maxTokensPerList); // try the next list
      listPath = `${rootDir}/${chainInfo.type}/${chainInfo.name}/${slugify(tokenListName)}-${off}.json`;
    }

    let list: Mutable<TokenList> | undefined = mapping.get(listPath);

    // 7. Check if there is an existing list, otherwise initialize empty tokens
    if (!list) {
      mapping.set(listPath, createList({
        name: tokenListName,
        tags: tokenList.tags,
        tokens: [],
        keywords: tokenList.keywords,
        logoURI: tokenList.logoURI
      }, defaultVersion));
      list = mapping.get(listPath);
    }

    // 8. Check if the list has reached the maximum tokens, if so write another list
    if (list?.tokens.length === maxTokensPerList) {
      console.info("Making a new list from: ", tokenList.name, ` ${i}`)
      return classify(tokenList, supportedNetworks, rootDir, seen, defaultVersion, defaultTokenListName, i);
    }

    // 9. Update token list
    list?.tokens.push(token);
  }

  return mapping;
}
