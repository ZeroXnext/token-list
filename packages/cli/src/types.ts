import {TokenList} from "@tokenlist-builder/core";
import {entry} from './index';

export interface Chain {
  name: string;
  type: string;
}

export interface ListIndex {
  timestamp: string; // representing last updated at
  lists: Array<Omit<TokenList, 'tokens'> & Record<"contents", ListURL>>;
}

export type Entry = typeof entry;

export type GHUserRawContentURL = `https://raw.githubusercontent.com`;

export type IndexName = "index" | string

// <base>/<network_type>/<chain_name>/<list-name>.json
export type ListPath = `${string}/${string}/${string}/${string}.json`;

//<base>/<network_type>/<"index" | name>.json
export type IndexPath = `${string}/${string}/${IndexName | `/${IndexName}`}.json`;

// <network_type>:<chain_id>:<token_address>
export type SeenKey = `${string}:${string}:${string}`;

// <GHUserRawContentURL>/<basePath>/<network_type>/<name>.json
// <GHUserRawContentURL>/<basePath>/<network_type>/<chain_name>/<"index" | name>.json
export type IndexURL = `${GHUserRawContentURL}/${IndexPath}`;

export type ListURL = `${GHUserRawContentURL}/${ListPath}`;
