import {TokenList} from '@tokenlist-builder/core';
import {DEFAULT_LIST_LOGO_URI, DEFAULT_LIST_VERSION, DEFAULT_TOKEN_LIST_NAME} from '@constants';

function initializeTokenList({
                               name,
                               logoURI,
                               tags,
                               keywords,
                               tokens
                             }: Omit<TokenList, "version" | "timestamp"> = {
  name: DEFAULT_TOKEN_LIST_NAME,
  logoURI: DEFAULT_LIST_LOGO_URI,
  tags: {},
  keywords: [],
  tokens: [],
}, version: TokenList['version'] = DEFAULT_LIST_VERSION): TokenList {
  return {
    name,
    logoURI,
    tags,
    version,
    keywords,
    timestamp: new Date().toISOString(),
    tokens,
  };
}

export default initializeTokenList;
