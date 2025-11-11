import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts', // entry point of your package
  output: [
    {
      file: 'dist/core.cjs.js',
      format: 'cjs',   // CommonJS for Node
      sourcemap: true
    },
    {
      file: 'dist/core.esm.js',
      format: 'esm',   // ESM for modern bundlers & browsers
      sourcemap: true
    },
  ],
  plugins: [
    nodeResolve({browser: true}), // resolve modules for browser
    commonjs(),                     // convert CJS to ESM
    json(),                         // import JSON schemas
    typescript({tsconfig: './tsconfig.json'}) // transpile TS
  ],
  external: ['ajv'] // don't bundle AJV;
};
