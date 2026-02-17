import { FlatCompat } from '@eslint/eslintrc'
import { includeIgnoreFile } from '@eslint/compat'
import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'url'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  ...compat.extends('airbnb-base', 'prettier'),
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.jest },
    },
    rules: {
      'no-param-reassign': ['error', { props: false }],
      'no-console': ['error', { allow: ['error'] }],
      'no-plusplus': 'off',
      'no-restricted-syntax': 'off',
    },
    settings: {
      'import/resolver': {
        webpack: {
          config: 'webpack.config.js',
        },
      },
    },
  },
]
