/**
 * current style guide extends 3 other style guides
 * airbnb, typescript, prettier
 * all conflicting rules should be switched off in preceeding guide
 */

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  extends: [
    'airbnb', // javascript syntax
    'airbnb/hooks', // rules for react hooks
    'plugin:@typescript-eslint/recommended', // typescript syntax
    'prettier', // code formating rules
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['react', 'import', 'prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  globals: {
    fetch: true,
    module: true,
    process: true,
  },
  rules: {
    'comma-dangle': [
      'warn',
      {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'ignore',
      },
    ],
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': 0,
    'max-len': ['warn', { code: 100, ignoreComments: true }],
    quotes: ['warn', 'single', { allowTemplateLiterals: true }],
    'import/no-unresolved': 0,
    'prettier/prettier': ['error'],
    'react/destructuring-assignment': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/jsx-no-bind': [
      'error',
      {
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
      },
    ],
  },
};
