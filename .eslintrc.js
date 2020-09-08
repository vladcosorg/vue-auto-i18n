module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.test.json',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    // 'import/prefer-default-export': 'off',
    // 'import/no-default-export': 'error',
  },
  overrides: [
    // typescript
    {
      parserOptions: {
        project: './tsconfig.test.json',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parseer': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
        },
      },
      parser: '@typescript-eslint/parser',
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint', 'import'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      rules: {
        // 'no-unused-vars': 'off',
        'import/no-unresolved': 'error',
        // '@typescript-eslint/no-unused-vars': 'off',
        // '@typescript-eslint/no-unused-vars-experimental': 'error',
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
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
    },
  ],
}
