import {TokenList} from '@tokenlist-builder/core';

export interface Chain {
  name: string;
  type: string;
}
// [network_type]/[chain_name]/[file_key]/[actual_list]
export type TokenListsMap = Map<string, Map<string, Map<string, TokenList>>>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type MutableTokenList = Mutable<TokenList>;
