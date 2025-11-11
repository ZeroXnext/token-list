import {TokenList} from "@tokenlist-builder/core";

export function createDefaultList(chainName: string): TokenList {
  return {
    name: "Default token list",
    tokens: [],
    logoURI: "",
    tags: {},
    version: {
      major: 1,
      patch: 0,
      minor: 0,
    },
    keywords: [],
    timestamp: new Date().toISOString(),
  };
}
