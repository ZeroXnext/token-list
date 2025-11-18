import {Config} from '@types';
import defaultConfig from './default';

async function loader(configName = "0xlist.config") {
  let config: Partial<Config>;
  try {
    config = {...defaultConfig, ...(await import(configName) ?? {})};
  } catch (error) {
    config = defaultConfig;
  }
  return config;
}

export default loader;
