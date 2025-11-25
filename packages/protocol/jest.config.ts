import { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: 'node',
  rootDir: '.',
  passWithNoTests: true,
  testMatch: ['/**/*.test.ts'],
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@utils$': '<rootDir>/src/utils/index.ts',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@types$': '<rootDir>/src/types/index.ts',
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
