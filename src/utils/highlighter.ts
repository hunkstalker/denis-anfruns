import { createHighlighter } from 'shiki'

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

export const getHighlighterInstance = async () => {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: [
				'github-light',
				'github-dark',
				{
					// Custom Godot Editor Theme
					name: 'godot-theme',
					type: 'dark',
					colors: {
						'editor.background': '#202531',
						'editor.foreground': '#e0e0e0',
					},
					tokenColors: [
						// 1. Comments (Grey)
						{
							scope: ['comment', 'punctuation.definition.comment'],
							settings: { foreground: '#6d6d6d', fontStyle: 'italic' },
						},
						// 2. Generic Keywords & Storage (Pink)
						{
							scope: ['keyword', 'storage.type', 'storage.modifier'],
							settings: { foreground: '#ff7b92' },
						},
						// 3. Functions (Blue)
						{
							scope: ['entity.name.function', 'support.function'],
							settings: { foreground: '#57b3ff' },
						},
						// 4. Types & Classes (Teal)
						{
							scope: [
								'entity.name.type',
								'support.class',
								'support.type',
								'entity.other.inherited-class',
							],
							settings: { foreground: '#42ffc2' },
						},
						// 5. Strings (Yellow)
						{
							scope: ['string', 'string.quoted'],
							settings: { foreground: '#ffe366' },
						},
						// 6. Numbers (Light Green)
						{
							scope: ['constant.numeric'],
							settings: { foreground: '#a1f5b5' },
						},
						// 7. Properties, Members & Operators (Light Blue) - Specific
						{
							scope: ['variable.other.property', 'variable.other.member', 'support.variable', 'keyword.operator'],
							settings: { foreground: '#c6e6ff' },
						},
						// 8. NodePaths & Dollar Sign (Green) - Specific
						{
							scope: [
								'meta.literal.nodepath',
								'entity.name.variable.node',
								'punctuation.definition.variable',
								'punctuation.accessor',
							],
							settings: { foreground: '#a1f5b5' },
						},
						// 9. Preload & Built-ins (Violet) - Specific override
						{
							scope: ['support.function.builtin', 'keyword.other.preload', 'constant.language'],
							settings: { foreground: '#d6acff' },
						},
						// 10. Annotations & Export (Orange) - Specific override
						{
							scope: [
								'keyword.control.annotation',
								'variable.annotation',
								'storage.type.annotation',
								'storage.modifier.annotation',
								'meta.annotation',
								'meta.annotation.identifier',
								'punctuation.definition.annotation',
								'punctuation.decorator',
								'keyword.control.export',
								'keyword.other.export',
							],
							settings: { foreground: '#ffb96a' },
						},
					],
				},
			],
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
				'shell',
				'gdscript',
			],
		})
	}
	return highlighter
}
