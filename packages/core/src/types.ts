import {TokenList} from '@uniswap/token-lists';

export interface TokenListIndex {
  timestamp: string;
  version: TokenList['version'],
  lists: (Omit<TokenList, "tokens"> & Record<"contents", string>)[],
}
export {TokenList};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
