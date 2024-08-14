import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';
import node from 'eslint-plugin-node';

export default [
  js.configs.recommended, // Use ESLint recommended rules
  {
    files: ['**/*.js', '**/*.jsx'], // Apply to JS files
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin, // Prettier plugin
      jest,
      node,
    },
    rules: {
      ...prettierConfig.rules, // Prettier configuration
      'prettier/prettier': 'error', // Show Prettier errors as ESLint errors
      'node/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] }, // Allows the use of ES Modules (import/export)
      ],
      'node/no-unpublished-require': 'off', // Allows using devDependencies in config files like `jest.setup.js`
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
];
