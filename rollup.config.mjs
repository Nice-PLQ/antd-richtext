import path from 'node:path';
import url from '@rollup/plugin-url';
import multiInput from 'rollup-plugin-multi-input';
import svgr from '@svgr/rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import staticImport from 'rollup-plugin-static-import';

import pkg from './package.json' assert { type: 'json' };

const externalDeps = Object.keys(pkg.dependencies || {});
const externalPeerDeps = Object.keys(pkg.peerDependencies || {});

export default {
  input: ['src/**/*.ts', 'src/**/*.tsx', '!src/__test__/**'],
  external: [...externalDeps, ...externalPeerDeps, /@tiptap\/pm/],
  plugins: [
    multiInput(),
    resolve({
      extensions: ['.ts', '.tsx'],
    }),
    commonjs(),
    url(),
    svgr({ memo: true }),
    alias({
      entries: {
        '@': path.resolve('./src'),
      },
    }),
    staticImport.default({ include: ['src/**/*.scss'] }),
    replace({
      preventAssignment: true,
      values: {
        PKG_VERSION: JSON.stringify(pkg.version),
      },
    }),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
  output: {
    dir: 'esm/',
  },
};
