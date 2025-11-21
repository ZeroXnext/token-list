import { Config } from './types';
import { supportedChains } from '@helpers';
import {
  DEFAULT_CHAINS,
  DEFAULT_LIST_LOGO_URI,
  DEFAULT_LIST_VERSION,
  DEFAULT_OUTPUT_DIR,
  DEFAULT_TOKEN_LIST_NAME,
  GITHUB_CONTENT_BASE_URL,
  SYNC_SOURCES,
} from '@constants';

const [allowedNetworkTypes, allowedChains] = supportedChains();
const defaultConfig: Config = {
  outputDir: DEFAULT_OUTPUT_DIR,
  defaultLogoUrl: DEFAULT_LIST_LOGO_URI,
  verbose: false,
  defaultListVersion: DEFAULT_LIST_VERSION,
  defaultTokenListName: DEFAULT_TOKEN_LIST_NAME,
  indexFileName: 'index',
  disallowedNetworkTypes: [],
  disallowedChains: [],
  allowedTokens: [],
  disallowedTokens: [],
  fileNamePattern: '',
  chainsMapping: DEFAULT_CHAINS,
  allowedChains,
  allowedNetworkTypes,
  plugins: [],
  contentBaseURL: GITHUB_CONTENT_BASE_URL,
  syncSources: SYNC_SOURCES,
};
export default defaultConfig;
