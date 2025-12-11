import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Global ignores
  {
    ignores: ['dist', 'node_modules', '.astro', '.github'],
  },
  
  // Astro Recommended Config
  ...eslintPluginAstro.configs.recommended,
  
  // Accessibility (JSX A11y)
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],

  // Custom Rules
  {
    rules: {
      // Override or add specific rules here if needed
    },
  },
];
