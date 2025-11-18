import {classify, Config, SeenKey} from "@tokenlist-builder/core";
import {Entry} from '@types';
import fetchExternal from '@helpers/fetch-external';
import output from '@helpers/output';
import validate from '@helpers/validate';

function addGenerateCommand(entry: Entry, config: Config) {
  entry
      .command("generate", "Generate token list", undefined, async () => {

        const lists = await fetchExternal(config.syncSources);
        const seen = new Set<SeenKey>();
        for (const list of lists) {
          if (!list) {
            continue;
          }
          const classified = classify(list, seen, config);
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
