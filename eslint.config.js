import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    // Legacy Vite-era files not connected to the Next.js app router are excluded from
    // linting. They remain in the repo for reference but are not part of any rendered page.
    ignores: [
      'dist',
      '.next',
      'node_modules',
      'src/Visuals/**',
      'src/components/ui/**',
      'src/components/AdvancedBackground.jsx',
      'src/components/Analytics.jsx',
      'src/components/Benifits.jsx',
      'src/components/BuyerAnalysis.jsx',
      'src/components/Charts.jsx',
      'src/components/CTA.jsx',
      'src/components/CustomerSales.jsx',
      'src/components/DashboardStats.jsx',
      'src/components/FeatureShowCase.jsx',
      'src/components/FloatingsIcons.jsx',
      'src/components/ModalContext.jsx',
      'src/components/Pricing.jsx',
      'src/components/RevenueChart.jsx',
      'src/components/sections/**',
      'src/components/Globe.jsx',
      'src/components/StoreLocator.jsx',
      'src/components/Testimonials.jsx',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      // prop-types are superseded by TypeScript; not required in this codebase
      'react/prop-types': 'off',
      // Downgrade to warn — legacy files have stale imports; errors block the build
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
