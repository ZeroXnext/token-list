import {TokenList, tokenListSchema} from '@tokenlist-builder/core';
import {DEFAULT_LIST_LOGO_URI, DEFAULT_LIST_VERSION, DEFAULT_TOKEN_LIST_NAME} from './constants';
import {MutableTokenList} from './types';
import {partitionArray} from './utils';
import path from 'node:path';
import * as fs from 'node:fs';

export function partitionTokenList(tokenList: Omit<TokenList, "version" | "timestamp">,
                                   version: TokenList['version'] = DEFAULT_LIST_VERSION,
                                   defaultTokenListName = DEFAULT_TOKEN_LIST_NAME): MutableTokenList[] {
  // Copy metadata from the list and the partitioned tokens
  const tokens = partitionArray(tokenList.tokens, tokenListSchema.properties.tokens.maxItems);
  let tokenLists: TokenList[] = [];

  let i = 0;
  for (const _tokens of tokens) {
    const name = `${tokenList.name}${i}`;
    i++;
    tokenLists.push(initializeTokenList({
      ...tokenList,
      name: name.length > tokenListSchema.properties.name.maxLength ? `${defaultTokenListName} ${i}` : name,
      tokens: _tokens
    }, version));
  }

  return tokenLists;
}

export function initializeTokenList({
                                      name,
                                      logoURI,
                                      tags,
                                      keywords,
                                      tokens
                                    }: Omit<TokenList, "version" | "timestamp"> = {
  name: DEFAULT_TOKEN_LIST_NAME,
  logoURI: DEFAULT_LIST_LOGO_URI,
  tags: {},
  keywords: [],
  tokens: [],
}, version: TokenList['version'] = DEFAULT_LIST_VERSION): TokenList {
  return {
    name,
    logoURI,
    tags,
    version,
    keywords,
    timestamp: new Date().toISOString(),
    tokens,
  };
}

export function getUniqueFilePath(dirPath: string, baseName: string, ext = 'json'): string {
  let filePath = path.join(dirPath, `${baseName}.${ext}`);
  let counter = 1;

  while (fs.existsSync(filePath)) {
    filePath = path.join(dirPath, `${baseName}-${counter}.${ext}`);
    counter++;
  }

  return filePath;
}
