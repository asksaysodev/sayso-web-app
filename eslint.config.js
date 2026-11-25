import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const LAZY_MESSAGE = "Use lazyView from '@/utils/lazyView' — plain lazy() crashes on stale-chunk reloads (SAYSO-APP-CZ)."

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
      // Bans `import { lazy } from 'react'` and `React.lazy(...)`. Not no-restricted-imports with
      // importNames: that also flags every `import * as React from 'react'` (the shadcn components).
      'no-restricted-syntax': ['error',
        {
          selector: "ImportDeclaration[source.value='react'] > ImportSpecifier[imported.name='lazy']",
          message: LAZY_MESSAGE,
        },
        {
          selector: "MemberExpression[object.name='React'][property.name='lazy']",
          message: LAZY_MESSAGE,
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/utils/lazyView.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
])
