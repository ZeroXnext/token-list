import {TokenList, tokenListSchema} from "@tokenlist-builder/core";
import {LIST_SOURCES} from '../constants';
import addFormats from 'ajv-formats';
import Ajv from 'ajv';


const ajv = new Ajv();
const validator = ajv.addSchema(tokenListSchema);
addFormats(ajv);

async function main(sources: string[]) {
  return Promise.all(sources.map<Promise<TokenList>>(async (item) => {
    const res = await fetch(LIST_SOURCES[item]);
    let data = await res.json();
    const result = validator.validate(tokenListSchema, data);
    const errorsPath = validator.errors?.map(item => item.instancePath) ?? [];
    if (errorsPath.includes('#/properties/tokens/maxItems') && errorsPath.length === 1) {
      return data;
    }
    if (!result) {
      throw new Error(`The list ${item} from ${LIST_SOURCES[item]} is invalid.`);
    }
    return data;
  }));
}

export default main;
