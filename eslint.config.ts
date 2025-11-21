import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig, globalIgnores} from "eslint/config";
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores([".turbo", "packages/**/node_modules", "packages/**/dist", "packages/**/.rollup.cache", "*.build.tsbuildinfo"]),
  {
    files: ["packages/**/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {js},
    extends: ["js/recommended"],
    languageOptions: {globals: globals.browser}
  },
  tseslint.configs.recommended,
  prettierConfig
]);
