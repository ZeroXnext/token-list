import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../schemas/tokenlist-index.schema.json";
import {TokenListIndex} from '../src';
import {schema as tokenListSchema} from '@uniswap/token-lists';

const ajv = new Ajv({allErrors: true});
addFormats(ajv);
ajv.addSchema(tokenListSchema);
ajv.addSchema(schema);


const validate = ajv.compile(schema);

describe("ListIndexItem schema", () => {
  it("valid minimal object", () => {
    const data = {
      version: {major: 1, minor: 0, patch: 0},
      timestamp: "2025-11-16T12:00:00Z",
      lists: [
        {
          name: "Example List",
          version: {major: 1, minor: 0, patch: 0},
          timestamp: "2025-11-16T12:00:00Z",
          logoURI: "https://example.com/logo.png",
          contents: "https://example.com/tokenlist.json"
        }
      ]
    } as TokenListIndex;
    expect(validate(data)).toBe(true);
  });

  it("valid object with optional fields", async () => {
    const data = {
      version: {major: 1, minor: 2, patch: 0},
      timestamp: "2025-11-16T12:00:00Z",
      lists: [
        {
          name: "Extended List",
          logoURI: "https://example.com/logo.png",
          version: {major: 1, minor: 2, patch: 0},
          timestamp: "2025-11-16T12:00:00Z",
          keywords: ["swap", "defi"],
          contents: "https://example.com/tokenlist.json"
        }
      ]
    } as TokenListIndex;
    const result = validate(data);
    expect(result).toBe(true);
  });

  it("invalid if tokens property exists", () => {
    const data = {
      version: {major: 1, minor: 0, patch: 0},
      timestamp: "2025-11-16T12:00:00Z",
      lists: [
        {
          name: "Bad List",
          tokens: [],
          contents: "https://example.com/tokenlist.json"
        }
      ]
    };
    expect(validate(data)).toBe(false);
  });

  it("invalid if contents missing in lists", () => {
    const data = {
      version: {major: 1, minor: 0, patch: 0},
      timestamp: "2025-11-16T12:00:00Z",
      lists: [
        {
          name: "Missing Contents List",
          logoURI: "https://example.com/logo.png"
        }
      ]
    };
    expect(validate(data)).toBe(false);
  });

  it("invalid if timestamp missing", () => {
    const data = {
      version: {major: 1, minor: 0, patch: 0},
      lists: [
        {
          name: "Valid List",
          contents: "https://example.com/tokenlist.json"
        }
      ]
    };
    expect(validate(data)).toBe(false);
  });

  it("invalid if version missing patch", () => {
    const data = {
      version: {major: 1, minor: 0, anior: 1}, // missing patch
      timestamp: "2025-11-16T12:00:00Z",
      lists: [
        {
          name: "Invalid Version List",
          contents: "https://example.com/tokenlist.json"
        }
      ]
    };
    expect(validate(data)).toBe(false);
  });

  it("invalid timestamp format", () => {
    const data = {
      version: {major: 1, minor: 0, patch: 0},
      timestamp: "2025-11-16 12:00", // invalid ISO 8601
      lists: [
        {
          name: "Invalid Timestamp List",
          contents: "https://example.com/tokenlist.json"
        }
      ]
    };
    expect(validate(data)).toBe(false);
  });
});
