import {TokenList, tokenListSchema} from "@tokenlist-builder/core";
import {DEFAULT_LIST_VERSION, DEFAULT_TOKEN_LIST_NAME} from '../constants';
import addFormats from 'ajv-formats';
import Ajv from 'ajv';
import {MutableTokenList} from '../types';
import {normalizeTokens, partitionTokenList} from '../helpers';

const ajv = new Ajv();
const validator = ajv.addSchema(tokenListSchema);
addFormats(ajv);


async function main(sources: string[], defaultTokenListName = DEFAULT_TOKEN_LIST_NAME, defaultVersion = DEFAULT_LIST_VERSION): Promise<TokenList[][]> {
  return Promise.all(sources.map<Promise<TokenList[]>>(async (src) => {
    const res = await fetch(src);
    let data = await res.json();
    data.tokens = normalizeTokens(data.tokens);
    const maybePartitionedLists = (data as TokenList).tokens.length > tokenListSchema.properties.tokens.maxItems ? partitionTokenList(data, defaultVersion, defaultTokenListName) : [data as MutableTokenList];

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
  }));
}

export default main;
