import type { TokenList, Version } from '@uniswap/token-lists';

export type Key = string | Buffer

export interface TokenListIndex {
  timestamp: string;
  version: TokenList['version'],
  lists: (Omit<TokenList, "tokens"> & Record<"contents", string>)[],
}

export { TokenList };

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

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

export interface Chain {
  name: string;
  type: string;
}

export type ChainMappingType = Map<number, Chain>

export interface ListIndex {
  timestamp: string; // representing last updated at
  lists: Array<Omit<TokenList, 'tokens'> & Record<"contents", ListURL>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChainValue = NonNullable<Config['chainsMapping']> extends Map<any, infer V> ? V : never; // Chain

export interface Plugin {
  name: string;
  description: string;
  url: string;
}

export interface Config<T = ChainMappingType> {
  verbose: boolean;
  defaultLogoUrl: string;
  chainsMapping: T;
  defaultListVersion: Version;
  outputDir: string;
  indexFileName: string;
  defaultTokenListName: string;
  contentBaseURL: GHUserRawContentURL | (string & {});
  syncSources: string[];
  allowedChains: ChainValue['name'][];
  disallowedChains: ChainValue['name'][];
  allowedNetworkTypes: ChainValue['type'][];
  disallowedNetworkTypes: ChainValue['type'][];
  allowedTokens: `0x${string}`[];
  disallowedTokens: `0x${string}`[];
  fileNamePattern: string;
  plugins: Plugin[];
}
