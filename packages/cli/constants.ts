export interface Chain {
  name: string;
  type: "testnet" | "mainnet"
}
export const CHAINS_MAPPING: Record<number, Chain> = {
  1: {name: "ethereum", type: "mainnet"},
  3: {name: "ropsten", type: "testnet"},
  4: {name: "rinkeby", type: "testnet"},
  5: {name: "goerli", type: "testnet"},
  10: {name: "optimism", type: "mainnet"},
  42: {name: "kovan", type: "testnet"},
  56: {name: "bsc", type: "mainnet"},
  69: {name: "optimism-kovan", type: "testnet"},
  100: {name: "gnosis", type: "mainnet"},
  137: {name: "polygon", type: "mainnet"},
  250: {name: "fantom", type: "mainnet"},
  4002: {name: "fantom-testnet", type: "testnet"},
  42161: {name: "arbitrum", type: "mainnet"},
  42220: {name: "celo", type: "mainnet"},
  43113: {name: "fuji", type: "testnet"},
  43114: {name: "avalanche", type: "mainnet"},
  80001: {name: "polygon-mumbai", type: "testnet"},
  84531: {name: "base-goerli", type: "testnet"},
  11155111: {name: "sepolia", type: "testnet"}
};

export const LIST_SOURCES: Record<string, string> = {
  "uniswap": "https://raw.githubusercontent.com/jab416171/uniswap-pairtokens/master/uniswap_pair_tokens.json",
  "aawave": "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokenlist.aave.eth.link"
};

export const DEFAULT_NETWORK_TYPES = ["testnet", "mainnet"]
