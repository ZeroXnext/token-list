import {Entry} from '@types';
import * as childProcess from 'node:child_process';
import load from '../helpers/load';
import {bump, TokenList} from '@tokenlist-builder/core';
import output from '../helpers/output';
import {parseGitRemoteUrl} from '@utils';
import {GITHUB_CONTENT_BASE_URL} from '@constants';
import path from 'node:path';


function addBumpCommand(entry: Entry): void {
  entry.command("bump", "It auto-updates the version of the token list, according to rules", () => {
  }, async (argv) => {
    const {output: outputDir} = argv;
    const stderr = childProcess.execSync("git remote get-url origin", {encoding: 'utf8'});
    const repo = parseGitRemoteUrl(stderr);
    const baseUrl = new URL(GITHUB_CONTENT_BASE_URL);
    baseUrl.pathname = path.join(repo.username, repo.repo);
    const [localLists] = load(outputDir);
    for (const [key, localList] of localLists.entries()) {
      try {
        const res = await fetch(path.join(baseUrl.toString(), key));
        if (res.status === 404) {
          // ignore, this means that the list is new
          console.info(`New list not versioned ${localList.name}, path: ${key}. skipping bump`);
          continue;
        }

        const remoteList = await res.json() as TokenList;

        const changed = bump(remoteList, localList);
        changed && output(key, localList);
      } catch (err) {
        console.error(err);
      }
    }
  });
}

export default addBumpCommand;
