import {bump} from "@helpers";
import {TokenList} from '@types';
import {timestamp} from "@utils";
import {TokenInfo} from '@uniswap/token-lists';

// mock timestamp()
jest.mock("../utils", () => ({
  __esModule: true,
  timestamp: jest.fn(() => "2024-01-01T00:00:00Z"),
}));


function makeList(tokens: TokenInfo[], version = {major: 1, minor: 0, patch: 0}) {
  return {
    name: "Test",
    timestamp: "2023-01-01T00:00:00Z",
    version,
    tokens,
  } as TokenList;
}

const A = {address: "0x1", chainId: 1, name: "A", symbol: "A", decimals: 18, logoURI: "", tags: []};
const B = {address: "0x2", chainId: 1, name: "B", symbol: "B", decimals: 18, logoURI: "", tags: []};

describe("bump", () => {

  test("adds a token → bumps minor", () => {
    const oldList = makeList([A], {major: 1, minor: 0, patch: 0});
    const newList = makeList([A, B], {major: 1, minor: 0, patch: 0});

    bump(oldList, newList);

    expect(newList.version.minor).toBe(1);
    expect(timestamp).toHaveBeenCalled();
  });

  test("removes a token → bumps major", () => {
    const oldList = makeList([A, B], {major: 1, minor: 2, patch: 0});
    const newList = makeList([A], {major: 1, minor: 2, patch: 0});

    bump(oldList, newList);

    expect(newList.version.major).toBe(2);
    expect(timestamp).toHaveBeenCalled();
  });

  test("modifies a token → bumps patch", () => {
    const oldList = makeList([A]);
    const newList = makeList([{...A, symbol: "NEW"}]);

    bump(oldList, newList);

    expect(newList.version.patch).toBe(1);
    expect(timestamp).toHaveBeenCalled();
  });

  test("address change → major bump", () => {
    const oldList = makeList([A]);
    const newList = makeList([{...A, address: "0xAAAA"}]);

    bump(oldList, newList);

    // the code treats this as remove + add, so major++
    expect(newList.version.major).toBe(2);
  });

  test("no changes → no bump", () => {
    const oldList = makeList([A]);
    const newList = makeList([A]);

    bump(oldList, newList);

    expect(newList.version).toEqual(oldList.version);
    expect(newList.timestamp).toBe(oldList.timestamp);
  });

  test("add + modify → latest branch wins (patch overrides minor)", () => {
    const oldList = makeList([A]);
    const newList = makeList([{...A, symbol: "MOD"}, B]);

    bump(oldList, newList);

    // because your code overwrites increment inside loops
    expect(newList.version.patch).toBe(1);
  });

  test("remove + modify → patch incorrectly overrides major (bug)", () => {
    const oldList = makeList([A], {major: 1, minor: 0, patch: 0});
    const newList = makeList([], {major: 1, minor: 0, patch: 0});

    // newList contains no A, so major bump expected
    bump(oldList, newList);

    expect(newList.version.major).toBe(2);
  });

  test("swap A→B → should be major bump", () => {
    const oldList = makeList([A]);
    const newList = makeList([B]);

    bump(oldList, newList);

    // expected major++, but your code wrongly handles `.find`
    expect(newList.version.major).toBe(2);
  });

});
