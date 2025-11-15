import {TokenList} from "@tokenlist-builder/core";
import fs from 'node:fs';

export default function outputBasic(output: string, tokenList: TokenList) {
  fs.writeFileSync(output, JSON.stringify(tokenList, null, 2), 'utf-8');
}
