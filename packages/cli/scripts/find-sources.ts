import {TokenList} from "@tokenlist-builder/core";
import {DEFAULT_LIST_VERSION, DEFAULT_TOKEN_LIST_NAME} from '../constants';
import {MutableTokenList} from '../types';
import {normalizeTokenList} from '../helpers';


async function main(sources: string[], defaultTokenListName = DEFAULT_TOKEN_LIST_NAME, defaultVersion = DEFAULT_LIST_VERSION): Promise<TokenList[][]> {
  return Promise.all(sources.map<Promise<TokenList[]>>(async (src) => {
    const res = await fetch(src);
    let data: MutableTokenList = await res.json();
    return normalizeTokenList(data, defaultTokenListName, defaultVersion);
  }));
}

export default main;
