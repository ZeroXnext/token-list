import {TokenList, tokenListSchema} from "@tokenlist-builder/core";

export function partitionArray<T>(array: T[], maxItems:number): T[][] {
  if (maxItems <= 0) throw new Error("maxItems must be greater than 0");

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += maxItems) {
    result.push(array.slice(i, i + maxItems));
  }
  return result;
}

export function partitionTokenList(tokenList: TokenList): TokenList[] {
  // Copy metadata from the list and the partitioned tokens
  const tokens = partitionArray(tokenList.tokens, tokenListSchema.properties.tokens.maxItems);
  let tokenLists: TokenList[] = [];
  let i = 0;
  for (const _tokens of tokens) {
    i++;
    tokenLists.push({
      ...tokenList,
      name: `${tokenList.name}${i}`, // use unique name because this will be the filename
      tokens: _tokens
    })
  }

  return tokenLists;
}

export function createDefaultList(chainName: string): TokenList {
  return {
    name: "Default token list",
    logoURI: "",
    tags: {},
    version: {
      major: 1,
      patch: 0,
      minor: 0,
    },
    keywords: [],
    timestamp: new Date().toISOString(),
    tokens: [],
  };
}
