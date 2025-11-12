import {TokenList, tokenListSchema} from "@tokenlist-builder/core";
import {DEFAULT_LIST_VERSION, DEFAULT_TOKEN_LIST_NAME, LIST_SOURCES} from '../constants';
import addFormats from 'ajv-formats';
import Ajv from 'ajv';
import {MutableTokenList} from '../types';
import {partitionTokenList} from '../helpers';

const ajv = new Ajv();
const validator = ajv.addSchema(tokenListSchema);
addFormats(ajv);


async function main(sources: string[], defaultTokenListName = DEFAULT_TOKEN_LIST_NAME, defaultVersion = DEFAULT_LIST_VERSION): Promise<TokenList[]> {
  return Promise.all(sources.flatMap<Promise<TokenList[]>>(async (item) => {
    const res = await fetch(LIST_SOURCES[item]);
    let data = await res.json();

    const maybePartitionedLists = (data as TokenList).tokens.length > tokenListSchema.properties.tokens.maxItems ? partitionTokenList(data, defaultVersion, undefined, defaultTokenListName) : [data as MutableTokenList];

    for (let list of maybePartitionedLists) {

      let result = validator.validate(tokenListSchema, list);
      const schemaPaths = validator.errors?.map(item => item.schemaPath) ?? [];

      if (schemaPaths.includes("#/properties/name/maxLength")) {

        list.name = defaultTokenListName;
        result = validator.validate(tokenListSchema, data);
      }
      if (!result) {
        throw new Error(validator.errors?.join(", "));
      }

    }

    return maybePartitionedLists;
  }).flat() as never as TokenList[]);
}

export default main;
