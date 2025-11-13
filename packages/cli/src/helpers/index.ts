import {TokenList, tokenListSchema} from '@tokenlist-builder/core';
import {DEFAULT_LIST_VERSION, DEFAULT_TOKEN_LIST_NAME} from '@constants';
import {MutableTokenList} from '@types';
import path from 'node:path';
import * as fs from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import classify from './classify';
import load from './load';
import resolve from './resolve';
import output from './output';
import partition from './partition';
import initializeTokenList from './initialize-token-list';

export {classify, load, resolve, output, initializeTokenList};

export function getUniqueFilePath(dirPath: string, baseName: string, ext = 'json'): string {
  let filePath = path.join(dirPath, `${baseName}.${ext}`);
  let counter = 1;

  while (fs.existsSync(filePath)) {
    filePath = path.join(dirPath, `${baseName}-${counter}.${ext}`);
    counter++;
  }

  return filePath;
}

export function normalizeTokens(tokens: TokenList['tokens']): TokenList['tokens'] {
  return (tokens ?? []).filter((token) => (
      token.logoURI !== null &&
      token.name.length < tokenListSchema.definitions.TokenInfo.properties.name.maxLength &&
      token.symbol.length < tokenListSchema.definitions.TokenInfo.properties.symbol.maxLength &&
      Object.hasOwn(token, 'decimals') &&
      new RegExp(tokenListSchema.definitions.TokenInfo.properties.symbol.anyOf[1].pattern).test(token.symbol)
  ));
}


export function normalizeTokenList(data: MutableTokenList, defaultTokenListName = DEFAULT_TOKEN_LIST_NAME, defaultVersion = DEFAULT_LIST_VERSION): TokenList[] {
  const ajv = new Ajv();
  const validator = ajv.addSchema(tokenListSchema);
  addFormats(ajv);

  data.tokens = normalizeTokens(data.tokens);
  const maybePartitionedLists = (data as TokenList).tokens.length > tokenListSchema.properties.tokens.maxItems ? partition(data, defaultVersion, defaultTokenListName) : [data as MutableTokenList];

  for (let list of maybePartitionedLists) {
    if (list.name.length > tokenListSchema.properties.name.maxLength) {
      list.name = defaultTokenListName;
    }
    let result = validator.validate(tokenListSchema, list);
    if (!result) {
      throw new Error(validator.errors?.map(item => `${item.instancePath} ${item.message}`)?.join(", \n"));
    }

  }

  return maybePartitionedLists;
}

