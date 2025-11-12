#!/usr/bin/env node
import yargs, {Argv} from 'yargs';
import {hideBin} from 'yargs/helpers';
import findSources from './scripts/find-sources';
import classify from './scripts/classify';
import {DEFAULT_NETWORK_TYPES, DEFAULT_SUPPORTED_CHAINS, LIST_SOURCES} from './constants';
import output from './scripts/output';

const allSources = Object.keys(LIST_SOURCES);
yargs(hideBin(process.argv)).command("generate", "Generate token list", (argv: Argv) => {
  return argv.option("verbose", {type: "boolean", alias: "v", default: false})
      .option("sources", {
        type: "array",
        description: "The default sources to generate from.",
        alias: "s",
        default: allSources,
        choices: allSources
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
        default: "dist",
      });
}, async (args) => {
  const {chains, allowedNetworkTypes, sources, verbose, output: outputDir} = args;
  const lists = await findSources(sources);
  const classified = classify(lists, chains, allowedNetworkTypes, verbose);
  output(outputDir, classified);
}).help('help').strictCommands().parse();
