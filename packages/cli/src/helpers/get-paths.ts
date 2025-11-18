import fs from 'node:fs';
import path from 'node:path';

/**
 * @param outputDir – the output directory
 * @param indexFileName – The filename of the index
 * @returns string[]
 * @description A basic method that will retrieve the token lists paths excluding the index.
 */
export default function getPaths(outputDir: string, indexFileName: string) {
  return fs.readdirSync(outputDir, {recursive: true}).map(item => item.toString()).filter((p) => {
    if (p === `${indexFileName}.json`) {
      return false;
    }
    try {
      return fs.statSync(path.join(outputDir, p.toString())).isFile();
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}
