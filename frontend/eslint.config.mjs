import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'drizzle/**',
      'public/**',
      'my-cv/**',
      'next-env.d.ts',
      'next.config.js',
    ],
  },
  js.configs.recommended,
  ...typescriptEslint.configs['flat/recommended'],
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@next/next': {
        rules: {
          'no-img-element': { create: () => ({}) },
        },
      },
      'jsx-a11y': {
        rules: {
          'anchor-has-content': { create: () => ({}) },
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty': 'off',
      'prefer-const': 'warn',
    },
  },
]
