import path from 'node:path';
import fs from 'node:fs';

export default function forEachIndex(networkTypes: string[], chains: string[], baseDir: string, indexFileName: string, cb: (dirPath: string, indexPath: string) => void) {
  for (const networkType of networkTypes) {
    for (const chainName of chains) {
      const directoryPath = path.join(networkType.toString(), chainName.toString());
      const indexPath = path.join(directoryPath, `${indexFileName}.json`);
      const fullPath = path.join(baseDir, directoryPath);
      if (!fs.existsSync(fullPath)) {
        continue;
      }

      cb(fullPath, indexPath);
    }
  }
}
