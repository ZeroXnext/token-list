import {Entry} from '@types';
import * as childProcess from 'node:child_process';
import loadFlatLocal from '../helpers/load-flat-local';
import {TokenList} from '@tokenlist-builder/core';
import bump from '../helpers/bump';
import outputBasic from '../helpers/output-basic';
import {parseGitRemoteUrl} from '@utils';


function addBumpCommand(entry: Entry): void {
  entry.command("bump", "It auto-updates the version of the token list, according to rules", () => {
  }, async (argv) => {
    const {output: outputDir} = argv;
    const stderr = childProcess.execSync("git remote get-url origin", {encoding: 'utf8'});
    const repo = parseGitRemoteUrl(stderr);
    const baseUrl = `https://raw.githubusercontent.com/${repo.username}/${repo.repo}`;

    const localLists = loadFlatLocal(outputDir);

    for (const [key, localList] of localLists.entries()) {
      try {
        const res = await fetch(`${baseUrl}${key}`);
        if (res.status === 404) {
          // ignore, this means that the list is new
          console.info(`New list not versioned ${localList.name}, path: ${key}. skipping bump`)
          continue;
        }

        const remoteList = await res.json() as TokenList;

        const changed = bump(remoteList, localList);
        changed && outputBasic(key, localList);
      } catch (err) {
        console.error(err);
      }
    }
  });
}

export default addBumpCommand;
