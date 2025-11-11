#!/usr/bin/env node
import yargs, {Argv} from 'yargs';
import {hideBin} from 'yargs/helpers';
import {CHAINS_MAPPING} from './constants';

const chains = Object.values(CHAINS_MAPPING);
yargs(hideBin(process.argv)).command("generate", "Generate token list", (argv: Argv) => {
  return argv.option("chains", {
    type: "array",
    description: "The chains to generate from",
    alias: "c",
    choices: ["ethereum", "solana"]
  }).option("includeTestnet", {type: "boolean", default: true, description: "Include testnet networks or not"});
}, (args) => {
  const {chains, includeTestnet} = args;


}).help('help').strictCommands().parse();
