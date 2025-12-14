import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginTailwind from 'eslint-plugin-tailwindcss'

export default [
	// Global ignores
	{
		ignores: ['dist', 'node_modules', '.astro', '.github'],
	},

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
		},
	},
]
