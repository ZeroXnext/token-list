import {
  DEFAULT_LIST_VERSION,
  DEFAULT_NETWORK_TYPES,
  DEFAULT_SUPPORTED_CHAINS,
  DEFAULT_TOKEN_LIST_NAME,
  LIST_SOURCES
} from '@constants';
import {classify, load, output, resolve} from '@helpers';
import {Entry} from '@types';

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
            .option("chains", {
              type: "array",
              description: "The chains to filter",
              alias: "c",
              default: DEFAULT_SUPPORTED_CHAINS,
              choices: DEFAULT_SUPPORTED_CHAINS
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
          chains,
          allowedNetworkTypes,
          sources,
          verbose,
          output: outputDir,
          defaultListName,
          defaultListVersion: [major, patch, minor]
        } = args;
        const lists = await resolve(sources, defaultListName, {
          major: parseInt(major.toString()),
          patch: parseInt(patch.toString()),
          minor: parseInt(minor.toString())
        });
        const [initialMap, initialSeen] = load(outputDir);
        const classified = classify(lists.flat(), chains, allowedNetworkTypes, initialMap, initialSeen, verbose);
        output(outputDir, classified, true);
      });
}

export default addGenerateCommand
