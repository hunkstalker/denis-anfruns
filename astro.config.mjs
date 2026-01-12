import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import svgr from 'vite-plugin-svgr'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
	site: 'https://denis-anfruns.dev',
	integrations: [
		tailwind(),
		react(),
		mdx({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
	],
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
		shikiConfig: {
			langAlias: {
				powerfx: 'vb',
			},
		},
	},
	prefetch: true,
	i18n: {
		defaultLocale: 'es',
		locales: ['es', 'en', 'ca'],
		routing: {
			prefixDefaultLocale: false,
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
