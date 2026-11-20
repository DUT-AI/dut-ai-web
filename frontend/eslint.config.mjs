import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '.yarn/**',
      'drizzle/**',
      'public/**',
      'my-cv/**',
      'next-env.d.ts',
      'next.config.js',
    ],
  },
  ...nextCoreWebVitals,
  prettierPluginRecommended,
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
]
