import {TokenList} from '@tokenlist-builder/core';
import {Mutable} from '@types';
import {timestamp} from '@utils';

/**
 * List versions must follow the rules:
 * - Increment major version when tokens are removedIncrement minor version when tokens are added
 * - Increment patch version when tokens already on the list have minor details changed (name, symbol, logo URL, decimals)
 * - Changing a token address or chain ID is considered both a remove and an add, and should be a major version update.
 * @param oldList – The old token list
 * @param newList – The new list containing modifications
 */
function autoVersion(oldList: TokenList, newList: Mutable<TokenList>) {
  const version: Mutable<TokenList['version']> = oldList.version;
  let increment: keyof TokenList['version'] | undefined;

  for (let token of newList.tokens) {
    const tokenInfo = oldList.tokens.find(oldToken => oldToken.address !== token.address);
    if (tokenInfo) {
      // New Token has been added
      increment = "minor";
    }
  }

  for (let token of oldList.tokens) {
    const tokenInfo = newList.tokens.find(tokenInfo => tokenInfo.address === token.address);
    if (!tokenInfo) {
      // Token has been removed
      increment = "major";
    }

    if (tokenInfo && (
        tokenInfo.name !== token.name ||
        tokenInfo.decimals !== token.decimals ||
        tokenInfo.symbol !== token.symbol ||
        tokenInfo.logoURI !== token.logoURI ||
        JSON.stringify(tokenInfo.tags) !== JSON.stringify(token.tags))) {
      increment = "patch";
    }
    // increment version
    if (increment) {
      version[increment] += 1;
      newList.version = version;
      newList.timestamp = timestamp();
    }
  }
}

export default autoVersion;
