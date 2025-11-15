import {hideBin} from 'yargs/helpers';
import yargs from 'yargs';


export const entry =
    yargs(hideBin(process.argv))
        .option("output", {
          type: "string",
          alias: "o",
          default: "dist/src",
        }).help('help');

