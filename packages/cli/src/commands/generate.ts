import {
  DEFAULT_LIST_VERSION,
  DEFAULT_NETWORK_TYPES,
  DEFAULT_SUPPORTED_CHAINS,
  DEFAULT_TOKEN_LIST_NAME,
  LIST_SOURCES
} from '@constants';
import {classify} from '@helpers';
import {Entry, SeenKey} from '@types';
import fetchExternal from '../helpers/fetch-external';
import outputBasic from '../helpers/output-basic';

function addGenerateCommand(entry: Entry) {
  entry
      .command("generate", "Generate token list", (argv) => {
        return argv.option("verbose", {type: "boolean", alias: "v", default: false})
            .option("defaultListName", {
              type: "string",
              default: DEFAULT_TOKEN_LIST_NAME,
              description: "The default token list name, used when name token list name is invalid",
              alias: "dl"
            })
            .option("defaultListVersion", {
              type: "array",
              default: [DEFAULT_LIST_VERSION.major, DEFAULT_LIST_VERSION.patch, DEFAULT_LIST_VERSION.minor],
              description: "The default list version",
              alias: "dv"
            })
            .option("sources", {
              type: "array",
              description: "The default sources to generate from.",
              alias: "s",
              default: LIST_SOURCES,
              choices: LIST_SOURCES
            })
            .option("allowedNetworkTypes", {
              type: "array",
              alias: "ant",
              default: DEFAULT_NETWORK_TYPES,
              choices: DEFAULT_NETWORK_TYPES,
              description: "Allowed network type"
            });
      }, async (args) => {
        const {
          allowedNetworkTypes,
          sources,
          output: outputDir,
          defaultListName,
          defaultListVersion: [major, patch, minor]
        } = args;
        const lists = await fetchExternal(sources);
        const version = {
          major: parseInt(major.toString()),
          patch: parseInt(patch.toString()),
          minor: parseInt(minor.toString())
        };
        let seen = new Set<SeenKey>();
        for (const list of lists) {
          if (!list) {
            continue;
          }
          const classified = classify(list, allowedNetworkTypes, outputDir, seen, version, defaultListName);
          for (const [filepath, list] of classified.entries()) {
            outputBasic(filepath, list);
          }
        }
      });
}

export default addGenerateCommand;
