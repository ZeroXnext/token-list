import * as fs from 'node:fs';
import * as path from 'node:path';
import {MappedTokenLists} from '../types';

function main(outputDir: string, tokenListMapping: MappedTokenLists) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const [chainType, chainMap] of tokenListMapping.entries()) {
    for (const [chainName, tokenList] of chainMap.entries()) {
      const dirPath = path.join(outputDir, chainType, chainName);
      const filePath = path.join(dirPath, `${tokenList.name}.json`);

      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(tokenList, null, 2), 'utf-8');
    }
  }
}

export default main;
