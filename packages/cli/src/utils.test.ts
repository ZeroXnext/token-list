import {partitionArray, slugify} from '@utils';

describe("utils", () => {
  describe("slugify", () => {
    it('converts spaces to hyphens and lowercases text', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes diacritics (accents)', () => {
      expect(slugify('Café Déjà Vu')).toBe('cafe-deja-vu');
    });

    it('collapses multiple spaces or underscores into a single hyphen', () => {
      expect(slugify('foo   bar___baz')).toBe('foo-bar-baz');
    });

    it('removes non-alphanumeric characters except hyphens', () => {
      expect(slugify('hello@world!2025')).toBe('helloworld2025');
    });

    it('removes leading and trailing hyphens', () => {
      expect(slugify('---hello-world---')).toBe('hello-world');
    });

    it('collapses multiple hyphens into one', () => {
      expect(slugify('foo--bar---baz')).toBe('foo-bar-baz');
    });

    it('handles strings with only special characters gracefully', () => {
      expect(slugify('!!!$$$%%%')).toBe('');
    });

    it('handles empty strings', () => {
      expect(slugify('')).toBe('');
    });

    it('trims whitespace before slugifying', () => {
      expect(slugify('   Hello World   ')).toBe('hello-world');
    });
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
