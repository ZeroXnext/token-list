import {TokenList} from '@tokenlist-builder/core';

export interface Chain {
  name: string;
  type: string;
}

export type MappedTokenLists = Map<string, Map<string, TokenList>>;
