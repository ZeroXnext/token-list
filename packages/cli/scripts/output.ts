import * as fs from 'node:fs';
import * as path from 'node:path';
import {TokenListsMap} from '../types';
import {getUniqueFilePath} from '../helpers';

function main(outputDir: string, tokenListMapping: TokenListsMap, override = true) {
  for (const [chainType, chainMap] of tokenListMapping.entries()) {
    for (const [chainName, tokenList] of chainMap.entries()) {
      const dirPath = path.join(outputDir, chainType, chainName);
      fs.mkdirSync(dirPath, {recursive: true});
      for (const [key, list] of tokenList.entries()) {
        const filePath = override ? path.join(dirPath, `${key}.json`) : getUniqueFilePath(dirPath, key);

        const exists = fs.existsSync(filePath);
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
        console.info(`${exists ? "Updated" : "Created"} "${list.name}" that has ${list.tokens.length} Tokens`);
      }

    }
  }
}

export default main;
