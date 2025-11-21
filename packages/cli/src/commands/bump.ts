import {Entry} from '@types';
import * as childProcess from 'node:child_process';
import load from '@helpers/load';
import {bump, Config, TokenList} from '@tokenlist-builder/core';
import output from '@helpers/output';
import {parseGitRemoteUrl} from '@utils';
import path from 'node:path';

function addBumpCommand(entry: Entry, config: Config): void {
  entry.command("bump", "It auto-updates the version of the token list, according to rules", () => {
  }, async () => {
    const stderr = childProcess.execSync("git remote get-url origin", {encoding: 'utf8'});
    const repo = parseGitRemoteUrl(stderr);
    const baseUrl = new URL(config.contentBaseURL);
    baseUrl.pathname = path.join(repo.username, repo.repo);
    const [localLists] = load(config);
    for (const [key, localList] of localLists.entries()) {
      try {
        const res = await fetch(path.join(baseUrl.toString(), key));
        if (res.status === 404) {
          // ignore, this means that the list is new
          console.info(`New list not versioned ${localList.name}, path: ${key}. skipping bump`);
          continue;
        }

        const remoteList = await res.json() as TokenList;

        if (bump(remoteList, localList)) {
          output(key, localList);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
}

export default addBumpCommand;
