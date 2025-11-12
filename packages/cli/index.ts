#!/usr/bin/env node
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import findSources from './scripts/find-sources';
import classify from './scripts/classify';
import {
  DEFAULT_LIST_VERSION,
  DEFAULT_NETWORK_TYPES,
  DEFAULT_SUPPORTED_CHAINS,
  DEFAULT_TOKEN_LIST_NAME,
  LIST_SOURCES
} from './constants';
import output from './scripts/output';
import parse from './scripts/parse';

yargs(hideBin(process.argv)).command("generate", "Generate token list", (argv) => {
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
      })
      .option("output", {
        type: "string",
        alias: "o",
        default: "dist/src",
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
  const lists = await findSources(sources, defaultListName, {
    major: parseInt(major.toString()),
    patch: parseInt(patch.toString()),
    minor: parseInt(minor.toString())
  });
  const initialMap = parse(outputDir);
  const classified = classify(lists.flat(), chains, allowedNetworkTypes, initialMap, verbose);
  output(outputDir, classified, true);
}).help('help').strictCommands().parse();
