import {classify, Config} from "@tokenlist-builder/core";
import {Entry} from '@types';
import fetchExternal from '@helpers/fetch-external';
import output from '@helpers/output';
import validate from '@helpers/validate';

function addGenerateCommand(entry: Entry, config: Config) {
  entry
      .command("generate", "Generate token list", async () => {
        const lists = await fetchExternal(config.syncSources);
        for (const list of lists) {
          if (!list) {
            continue;
          }
          const classified = classify(list, config);
          for (const [filepath, list] of classified.entries()) {
            const [valid, errors] = validate(list);
            if (valid) {
              output(filepath, list);
            } else {
              console.warn(`${list.name}`, errors);
            }
          }
        }
      });
}

export default addGenerateCommand;
