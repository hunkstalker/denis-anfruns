import { createHighlighter } from 'shiki'

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

export const getHighlighterInstance = async () => {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['github-light', 'github-dark'],
			langs: [
				'javascript',
				'typescript',
				'tsx',
				'jsx',
				'astro',
				'css',
				'html',
				'json',
				'bash',
				'yaml',
				'mdx',
				'markdown',
				'diff',
				'shell'
			],
		})
	}
	return highlighter
}
