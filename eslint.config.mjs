import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // Ignore auto-generated and OG image files (Satori requires inline styles)
  {
    ignores: [
      'next-env.d.ts',
      '.next/**',
      '**/og/route.tsx',
      '**/og/route.ts',
      'components/OGImage.tsx',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin.flatConfig.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'jsx-a11y': jsxA11y,
    },

    rules: {
      /**
       * CORE SAFETY
       * Note: base no-unused-vars is turned off in favour of the TypeScript-aware
       * version which correctly handles interface parameter names, overloads, etc.
       */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * REACT RULES
       */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /**
       * DESIGN SYSTEM ENFORCEMENT
       */

      // ❌ Prevent inline styles (breaks system consistency)
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'Inline styles are forbidden. Use Tailwind tokens.',
        },
      ],

      // ❌ Prevent arbitrary relative imports and enforce path aliases.
      'no-restricted-imports': ['error', { patterns: ['../*', '../../*', '../../../*'] }],

      /**
       * ACCESSIBILITY
       */
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-role': 'error',

      /**
       * CODE QUALITY
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
