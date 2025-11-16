import {Entry} from '@types';
import allNetworkTypes from '../helpers/all-network-types';
import allChainNames from '../helpers/all-chain-names';
import {load} from '@helpers';
import forEachIndex from '../helpers/for-each-index';
import buildIndex from '../helpers/build-index';
import path from 'node:path';
import {GITHUB_CONTENT_BASE_URL} from '@constants';
import {parseGitRemoteUrl} from '@utils';
import childProcess from 'node:child_process';

// user -> cli -> aggregate -> network_type -> index.json
// user -> cli -> aggregate -> network_type -> chain_name -> index.json
export default function addAggregate(entry: Entry) {
  const defaultChains = allChainNames();
  const defaultNetworkTypes = allNetworkTypes();

  entry.command("aggregate", "It aggregates a directory of token lists into <directory>/index.json", (args) => {
    return args.option("network_types", {
      alias: "nt",
      description: "List of network types to index",
      type: "array",
      default: defaultNetworkTypes,
    }).option("index_file_name", {
      alias: "in",
      description: "The name of the index file created for specified network_type / chain_name",
      default: "index",
    }).option("chains", {
      alias: "c",
      description: "List of chains to index",
      type: "array",
      default: defaultChains,
    });

  }, (argv) => {

    const {network_types: networkTypes, chains, output, index_file_name: indexFileName} = argv;

    // Enforce string[] for networkTypes
    networkTypes.forEach((networkType) => {
      if (typeof networkType !== 'string') {
        throw new Error("Network type '" + networkType + "' must be a string");
      }
    });

    const stderr = childProcess.execSync("git remote get-url origin", {encoding: 'utf8'});
    const {repo, username} = parseGitRemoteUrl(stderr);

    // Enforce string[] for chains
    chains.forEach((chain) => {
      if (typeof chain !== 'string') {
        throw new Error("Chain name '" + chain + "' must be a string");
      }
    });
    // Build the existent directories based on provided input and then load each index
    forEachIndex(networkTypes as string[], chains as string[], output, indexFileName, (dirPath, indexPath) => {
      const [loaded] = load(dirPath);
      buildIndex(path.join(GITHUB_CONTENT_BASE_URL, username, repo), path.join(output, indexPath), loaded);
    });
  });
}
