module.exports = {
  root: true,
  env: { browser: true, node: true, es2024: true },
  parserOptions: { ecmaVersion: 2024, sourceType: 'module' },
  extends: ['eslint:recommended', 'plugin:astro/recommended', 'prettier'],
  plugins: ['astro'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json',
      },
      extends: ['plugin:astro/recommended'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: './tsconfig.json' },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {},
    },
  ],
}