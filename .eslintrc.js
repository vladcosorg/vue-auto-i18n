module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  plugins: ['import'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',

    quotes: ['warn', 'single', { avoidEscape: true }],

    'unicorn/prevent-abbreviations': 'off',
    'unicorn/numeric-separators-style': 'warn',
    'unicorn/no-unsafe-regex': 'warn',
    'unicorn/no-unused-properties': 'warn',
    'unicorn/prefer-replace-all': 'warn',
    'unicorn/no-nested-ternary': 'off',

    'import/no-unresolved': 'warn',
    'import/extensions': ['warn', 'always', { js: 'never', ts: 'never' }],
    'import/order': [
      'warn',
      { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
    ],
    'import/no-unused-modules': [
      'warn',
      {
        unusedExports: true,
        missingExports: true,
        ignoreExports: ['**/*.d.ts', 'test/**/*.*', '*.js'],
      },
    ],
    'import/newline-after-import': 'warn',

    'no-console': 'warn',
  },

  overrides: [
    // typescript
    {
      parser: '@typescript-eslint/parser',
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      rules: {
        'import/no-unresolved': 'error',
      },
    },

    // test files
    {
      files: ['*.test.js', '*.test.ts'],
      plugins: ['jest'],
      env: {
        es6: true,
        node: true,
        'jest/globals': true,
      },
      globals: {
        getConnection: 'readonly',
      },
      extends: ['plugin:jest/recommended'],

      rules: {
        'import/no-named-as-default-member': 'off',
      },
    },
  ],
}
