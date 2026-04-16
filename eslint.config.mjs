import js from '@eslint/js';
import next from 'eslint-config-next';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'jsx-a11y': jsxA11y,
    },

    rules: {
      /**
       * CORE SAFETY
       */
      'no-unused-vars': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
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

      // ❌ Prevent arbitrary spacing values (Tailwind drift)
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', '../../*', '../../../*'],
          message: 'Use path aliases instead of relative imports.',
        },
      ],

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
