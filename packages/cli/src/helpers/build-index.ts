import {ListIndex, ListPath, ListURL, Mutable, timestamp, TokenList} from "@tokenlist-builder/core";
import fs from 'node:fs';
import path from 'node:path';

export default function buildIndex(remoteBaseUrl: string, indexFullPath: string, listMap: Map<ListPath, Mutable<Omit<TokenList, "tokens"> & Partial<Pick<TokenList, "tokens">>>>) {
  // Directory path already exists, just build the index and write to the disk
  const indexData: ListIndex = {
    lists: [],
    timestamp: timestamp()
  };

  // Assuming the base is already merged into the listPath
  for (const [listPath, list] of listMap.entries()) {
    delete list?.tokens;
    const listUrl = path.join(remoteBaseUrl, listPath) as ListURL;
    indexData.lists.push({
      ...list,
      contents: listUrl,
    });
  }
  fs.writeFileSync(indexFullPath, JSON.stringify(indexData, null, 2), {encoding: "utf8"});
  return indexData;
}
