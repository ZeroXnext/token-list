import {partitionArray, slugify} from '@utils';

describe("utils", () => {
  it('should slugify text', () => {
    expect(slugify("Hello World")).toEqual("hello-world");
  });

  describe('partitionArray', () => {
    it('splits an array into chunks of the given size', () => {
      const result = partitionArray([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('returns the same array if maxItems >= array length', () => {
      const result = partitionArray([1, 2, 3], 5);
      expect(result).toEqual([[1, 2, 3]]);
    });

    it('returns an empty array when given an empty array', () => {
      const result = partitionArray([], 3);
      expect(result).toEqual([]);
    });

    it('throws an error if maxItems is 0 or negative', () => {
      expect(() => partitionArray([1, 2, 3], 0)).toThrow('maxItems must be greater than 0');
      expect(() => partitionArray([1, 2, 3], -2)).toThrow('maxItems must be greater than 0');
    });

    it('works with non-numeric data types', () => {
      const result = partitionArray(['a', 'b', 'c', 'd'], 3);
      expect(result).toEqual([['a', 'b', 'c'], ['d']]);
    });
  });
});
