import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export interface TilMeta {
	pubDate?: string
	tags?: string[]
}

export function getTilMeta(slug: string): TilMeta {
	try {
		// slug format is typically "folder/lang" e.g. "fix-dark-mode-fouc/es"
		const folder = slug.split('/')[0]
		const metaPath = join(process.cwd(), 'src/content/til', folder, 'meta.json')

		if (existsSync(metaPath)) {
			const fileContent = readFileSync(metaPath, 'utf-8')
			return JSON.parse(fileContent)
		}
	} catch (_error) {
		// console.warn removed
	}

	return {}
}
