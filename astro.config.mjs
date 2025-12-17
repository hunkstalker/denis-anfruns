import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import svgr from 'vite-plugin-svgr'
import { normalize } from './scripts/normalize-content.mjs'

// https://astro.build/config
export default defineConfig({
	site: 'https://denis-anfruns.dev',
	integrations: [
		tailwind(),
		react(),
		mdx(),
		// Auto-normalization disabled to prevent double-refresh loop in dev
		// Run 'pnpm normalize:content' manually if needed.
		// {
		// 	name: 'normalize-content',
		// 	hooks: {
		// 		'astro:config:setup': async () => {
		// 			await normalize()
		// 		},
		// 	},
		// },

	],
	prefetch: true,
	i18n: {
		defaultLocale: 'es',
		locales: ['es', 'en', 'ca'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	markdown: {
		shikiConfig: {
			langAlias: {
				powerfx: 'vb',
			},
		},
	},
	vite: {
		plugins: [svgr()],
		build: {
			rollupOptions: {
				external: ['/pagefind/pagefind.js'],
			},
		},
	},
	experimental: {
		svgo: {
			svgo: true,
		},
	},
})
