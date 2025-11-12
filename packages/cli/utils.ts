export function partitionArray<T>(array: T[], maxItems: number): T[][] {
  if (maxItems <= 0) throw new Error("maxItems must be greater than 0");

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += maxItems) {
    result.push(array.slice(i, i + maxItems));
  }
  return result;
}
