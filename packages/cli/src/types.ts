import {entry} from './index';

export interface Chain {
  name: string;
  type: string;
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};


export type Entry = typeof entry;

// <root>/<network_type>/<chain_name>/<list-name>.json
export type ListPath = `${string}/${string}/${string}/${string}.json`;

// <network_type>:<chain_id>:<token_address>
export type SeenKey = `${string}:${string}:${string}`
