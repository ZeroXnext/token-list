import {TokenList} from "@tokenlist-builder/core";

export default function fetchExternal(sources: string[]) {
  return Promise.all(sources.map(async (source) => {
    try {
      const res = await fetch(source);
      if (!res.ok) {
        console.warn("Failed to load source: ", source);
        return null;
      }
      return await res.json() as TokenList;
    } catch {
      console.warn("Failed to load source: ", source);
      return null;
    }
  }));
}
