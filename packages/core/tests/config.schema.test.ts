import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../schemas/config.schema.json";

const ajv = new Ajv({allErrors: true});
addFormats(ajv);

const validate = ajv.compile(schema);

describe("Config Schema", () => {
  it("accepts a fully valid config object", () => {
    const data = {
      allowedChains: ["ethereum", "Polygon"],
      disallowedChains: ["bsc"],
      allowedTokens: ["0x0000000000000000000000000000000000000001"],
      disallowedTokens: ["0x0000000000000000000000000000000000000002"],
      minTokenLiquidityScore: 50,
      minTokenAge: 86400,
      validNetworkTypes: ["mainnet", "layer2"],
      fileNamePattern: "^[a-z0-9_-]+\\.json$"
    };

    expect(validate(data)).toBe(true);
  });

  it("rejects extra properties", () => {
    const data = {
      allowedChains: [],
      bogus: true
    };

    expect(validate(data)).toBe(false);
  });

  it("rejects invalid token address formats", () => {
    const data = {
      allowedTokens: ["not-an-address"]
    };

    expect(validate(data)).toBe(false);
  });

  it("rejects invalid disallowedTokens format", () => {
    const data = {
      disallowedTokens: ["0x1234"]
    };

    expect(validate(data)).toBe(false);
  });

  it("rejects negative minTokenLiquidityScore", () => {
    const data = {
      minTokenLiquidityScore: -1
    };

    expect(validate(data)).toBe(false);
  });

  it("rejects negative minTokenAge", () => {
    const data = {
      minTokenAge: -10
    };

    expect(validate(data)).toBe(false);
  });

  it("accepts arrays for chains", () => {
    const data = {
      allowedChains: ["eth", "arbitrum"],
      disallowedChains: ["badchain"]
    };

    expect(validate(data)).toBe(true);
  });

  it("rejects non-string items in allowedChains", () => {
    const data = {
      allowedChains: [123]
    };

    expect(validate(data)).toBe(false);
  });

  it("rejects non-string items in validNetworkTypes", () => {
    const data = {
      validNetworkTypes: ["mainnet", 123]
    };

    expect(validate(data)).toBe(false);
  });

  it("accepts fileNamePattern as a string", () => {
    const data = {
      fileNamePattern: "^[a-z]+\\.json$"
    };

    expect(validate(data)).toBe(true);
  });

  it("rejects non-string fileNamePattern", () => {
    const data = {
      fileNamePattern: 42
    };

    expect(validate(data)).toBe(false);
  });
});
