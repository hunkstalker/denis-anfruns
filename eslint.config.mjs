import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginTailwind from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'

export default [
	// Global ignores
	{
		ignores: ['dist', 'node_modules', '.astro', '.github'],
	},

	// TypeScript
	...tseslint.configs.recommended,

	// Astro Recommended Config
	...eslintPluginAstro.configs.recommended,

	// Accessibility (JSX A11y)
	...eslintPluginAstro.configs['jsx-a11y-recommended'],

	// Tailwind CSS
	...eslintPluginTailwind.configs['flat/recommended'],

	// Custom Rules
	{
		rules: {
			'tailwindcss/no-custom-classname': 'off', // Allow custom classnames
			'tailwindcss/classnames-order': 'off', // Prettier handles this
			'@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		files: ['**/*.cjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	{
		files: ['src/env.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
]
