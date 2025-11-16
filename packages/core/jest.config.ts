import {Config} from "jest";
import {createDefaultPreset} from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  testMatch: ["tests/*.test.ts","<rootDir>/**/**/.test.ts", "<rootDir>/**/*.test.ts"],
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
} as Config;
