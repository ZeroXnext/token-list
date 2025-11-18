import {Entry} from '@types';
import load from '@helpers/load';
import forEachIndex from '@helpers/for-each-index';
import buildIndex from '@helpers/build-index';
import path from 'node:path';
import {parseGitRemoteUrl} from '@utils';
import childProcess from 'node:child_process';
import mergeIndexes from '@helpers/merge-indexes';
import {Config, ListIndex} from '@tokenlist-builder/core';
import fs from 'node:fs';

// user -> cli -> aggregate -> network_type -> index.json
// user -> cli -> aggregate -> network_type -> chain_name -> index.json
export default function addAggregate(entry: Entry, config: Config) {
  entry.command("aggregate", "It aggregates a directory of token lists into <directory>/index.json", (args) => {
  }, () => {
    // Enforce string[] for networkTypes
    config.allowedNetworkTypes.forEach((networkType) => {
      if (typeof networkType !== 'string') {
        throw new Error("Network type '" + networkType + "' must be a string");
      }
    });

    const stderr = childProcess.execSync("git remote get-url origin", {encoding: 'utf8'});
    const {repo, username} = parseGitRemoteUrl(stderr);

    // Enforce string[] for chains
    config.allowedChains.forEach((chain) => {
      if (typeof chain !== 'string') {
        throw new Error("Chain name '" + chain + "' must be a string");
      }
    });

    const indexes: ListIndex[] = [];
    // Build the existent directories based on provided input and then load each index
    forEachIndex((_, indexPath) => {
      const [loaded] = load(config);
      const listIndex = buildIndex(path.join(config.contentBaseURL, username, repo), path.join(config.outputDir, indexPath), loaded);
      indexes.push(listIndex);
    }, config);

    const chainTypeIndexes = mergeIndexes(indexes, path.join(config.contentBaseURL, username, repo, config.outputDir));
    for (let [networkType, listIndex] of chainTypeIndexes.entries()) {
      fs.writeFileSync(path.join(config.outputDir, networkType, `${config.indexFileName}.json`), JSON.stringify(listIndex, null, 2), 'utf8');
    }
  });
}
