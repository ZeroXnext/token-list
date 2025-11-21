import {Config} from "jest";
import {createDefaultPreset} from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["/**/*.test.ts"],
  moduleNameMapper: {
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@helpers$": "<rootDir>/src/helpers/index.ts",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@utils$": "<rootDir>/src/utils/index.ts",
    "^@constants$": "<rootDir>/src/constants.ts",
    "^@config$": "<rootDir>/src/config/index.ts",
  },
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
} as Config;
