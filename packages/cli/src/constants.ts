import {Chain} from '@types';

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
  11155111: {name: "sepolia", type: "testnet"},
  8453: {name: "base", type: "mainnet"},
  324: {name: "zkSync Mainnet", type: "mainnet"},
};

export const LIST_SOURCES = [
  "https://raw.githubusercontent.com/jab416171/uniswap-pairtokens/master/uniswap_pair_tokens.json",
  "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokenlist.aave.eth.link",
  "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link",
  "https://defiprime.com/defiprime.tokenlist.json",
];

export const DEFAULT_NETWORK_TYPES = ["testnet", "mainnet"];
export const DEFAULT_SUPPORTED_CHAINS = Object.values(CHAINS_MAPPING).map(item => item.name);


export const GITHUB_CONTENT_BASE_URL = "https://raw.githubusercontent.com"
