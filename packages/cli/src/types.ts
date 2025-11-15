import {TokenList} from '@tokenlist-builder/core';
import {entry} from './index';

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


export type Entry = typeof entry;


// <root>/<network_type>/<chain_name>/<list-name>.json
export type ListPath = `${string}/${string}/${string}/${string}.json`;

// <network_type>:<chain_id>:<token_address>
export type SeenKey = `${string}:${string}:${string}`
