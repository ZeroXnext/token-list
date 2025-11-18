import {Config} from '@types';
import defaultConfig from './default';

async function loader(configName = "0xlist.config") {
  const config: Partial<Config> = await import(configName) ?? {};
  return {...defaultConfig, ...config};
}

export default loader;
