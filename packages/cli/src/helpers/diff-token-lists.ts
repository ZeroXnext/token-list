import {TokenList} from '@tokenlist-builder/core';

interface TokenListChangeLog {
  added: TokenList['tokens'],
  removed: TokenList['tokens'],
  modified: TokenList['tokens'],
}

/**
 * List versions must follow the rules:
 * - Increment major version when tokens are removedIncrement minor version when tokens are added
 * - Increment patch version when tokens already on the list have minor details changed (name, symbol, logo URL, decimals)
 * - Changing a token address or chain ID is considered both a remove and an add, and should be a major version update.
 */
export function diffTokenLists(oldList: TokenList, newList: TokenList): [TokenList['version'], TokenListChangeLog] {

  const added: TokenList['tokens'] = [];
  const removed: TokenList['tokens'] = [];
  const modified: TokenList['tokens'] = [];
  const version: TokenList['version'] = oldList.version;

  for (let token of newList.tokens) {
    const tokenInfo = oldList.tokens.find(oldToken => oldToken.address !== token.address);
    if (tokenInfo) {
      added.push(token);
    }
  }

  for (let token of oldList.tokens) {
    const tokenInfo = newList.tokens.find(tokenInfo => tokenInfo.address === token.address);

    if (!tokenInfo) {
      removed.push(token);
    }

    if (tokenInfo && (
        tokenInfo.name !== token.name ||
        tokenInfo.decimals !== token.decimals ||
        tokenInfo.symbol !== token.symbol ||
        tokenInfo.logoURI !== token.logoURI ||
        JSON.stringify(tokenInfo.tags) !== JSON.stringify(token.tags))) {
      modified.push(token);
    }
  }

  return [version, {added, modified, removed}];
}
