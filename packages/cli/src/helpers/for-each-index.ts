import path from 'node:path';
import fs from 'node:fs';
import {Config} from '@tokenlist-builder/core';

export default function forEachIndex(cb: (dirPath: string, indexPath: string) => void, config: Config) {
  const {allowedNetworkTypes, allowedChains, indexFileName, outputDir} = config;
  for (const networkType of allowedNetworkTypes) {
    for (const chainName of allowedChains) {
      const directoryPath = path.join(networkType.toString(), chainName.toString());
      const indexPath = path.join(directoryPath, `${indexFileName}.json`);
      const fullPath = path.join(outputDir, directoryPath);
      if (!fs.existsSync(fullPath)) {
        continue;
      }

      cb(fullPath, indexPath);
    }
  }
}
