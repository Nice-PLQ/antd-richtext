module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'prettier'
  ],
  plugins: ['react', 'react-hooks', 'import', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    curly: ['error', 'all'],
    'no-console': 'off',
    'no-debugger': 'warn',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': 'off',
    'react/destructuring-assignment': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unstable-nested-components': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-throw-literal': 'error',
    'no-case-declarations': 'off',
    'prefer-promise-reject-errors': 'off',
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "endOfLine": "auto"
      }
    ],
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',    // Node "builtin" modules (e.g. fs, path)
          'external',   // "external" modules (e.g. lodash, react)
          'object',     // "object" imports (e.g. import { foo } from 'bar')
          //'type',       // "type" imports (e.g. import type { Foo } from 'bar')
          'internal',   // "internal" modules (e.g. src/utils)
          'parent',     // "parent" modules (e.g. ../utils)
          'sibling',    // "sibling" modules (e.g. ./Button)
          'index',      // "index" modules (e.g. ./)
        ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
      },
    ],
  },
};
