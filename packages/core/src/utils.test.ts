import {slugify} from '@utils';

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
});
