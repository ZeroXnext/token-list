export function partitionArray<T>(array: T[], maxItems: number): T[][] {
  if (maxItems <= 0) throw new Error("maxItems must be greater than 0");

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += maxItems) {
    result.push(array.slice(i, i + maxItems));
  }
  return result;
}

export function slugify(str: string): string {
  return str
      .normalize("NFD")                 // decompose accents/diacritics
      .replace(/[\u0300-\u036f]/g, '')  // remove the accents
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')          // spaces/underscores → hyphens
      .replace(/[^\w-]+/g, '')          // remove non-alphanumeric except hyphen
      .replace(/--+/g, '-')             // collapse multiple hyphens
      .replace(/^-+|-+$/g, '');         // remove leading/trailing hyphens
}
