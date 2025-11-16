import fs from 'node:fs';
import path from 'node:path';

export default function getPaths(outputDir: string) {
  return fs.readdirSync(outputDir, {recursive: true}).map(item => item.toString()).filter((p) => {
    try {
      return fs.statSync(path.join(outputDir, p.toString())).isFile();
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}
