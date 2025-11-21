import { Config } from '@types';
import defaultConfig from './default';

/**
 * @todo: Rigorously validate config before returning
 */
async function loader(cfg: string | Config): Promise<Config> {

  let config: Partial<Config>;
  if (typeof cfg === "string") {
    try {
      config = { ...defaultConfig, ...(await import(cfg ?? "0xlist.config") ?? {}).default as Config };

    } catch {
      config = defaultConfig;
    }
  } else {
    config = cfg;
  }

  return config as Config;
}

export default loader;
