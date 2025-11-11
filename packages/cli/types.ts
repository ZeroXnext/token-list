import {TokenList} from '@tokenlist-builder/core';

export interface Chain {
  name: string;
  type: string;
}

export type MappedChainsType = Map<string, Map<string, TokenList>>;
