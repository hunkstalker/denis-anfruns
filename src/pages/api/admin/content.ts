import type { APIRoute } from 'astro'
import fs from 'fs'
import path from 'path'

// export const prerender = false // Disabled for static build consistency

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content')

// Helper to check if a directory is a "Series Group" (has nested parts)
function isSeriesGroup(dirPath: string) {
	try {
		const children = fs.readdirSync(dirPath)
		// Heuristic: If it has subdirectories that contain meta.json, it's a series container
		return children.some((child) => {
			const childPath = path.join(dirPath, child)
			return (
				fs.statSync(childPath).isDirectory() && fs.existsSync(path.join(childPath, 'meta.json'))
			)
		})
	} catch {
		return false
	}
}

function getRecursiveFiles(dir: string, collection: string, items: any[] = []) {
	if (!fs.existsSync(dir)) return items

	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const fullPath = path.join(dir, entry.name)
			const relativePath = path.relative(path.join(CONTENT_DIR, collection), fullPath) // e.g., "git-basics/part-1"
			const metaPath = path.join(fullPath, 'meta.json')

			// Check if this folder has a direct meta.json (It's an ITEM)
			if (fs.existsSync(metaPath)) {
				try {
					const content = fs.readFileSync(metaPath, 'utf-8')
					const json = JSON.parse(content)

					// Path Inference Logic (The "Brain")
					const parts = relativePath.split(path.sep)
					// parts[0] is usually the grouping folder if depth > 1

					let seriesId = undefined

					// Logic: If path is 'group/slug', then 'group' is seriesId.
					// If path is 'slug', then no seriesId.
					if (parts.length > 1) {
						seriesId = parts[0]
					}

					// Special case for Devlog: It seems devlog always has project folder?
					// Let's rely on the generic depth logic.
					// Depth 1 (slug) -> No Series
					// Depth 2 (series/slug) -> Series = parts[0]

					// Title Extraction (New logic requested by user)
					// If meta.json doesn't have title, try to find it in sibling MDX files.
					let title = json.title
					if (!title) {
						const potentialMdxFiles = ['es.mdx', 'index.mdx', 'en.mdx'] // Priority: Spanish > Index > English
						for (const mdxFile of potentialMdxFiles) {
							const mdxPath = path.join(fullPath, mdxFile)
							if (fs.existsSync(mdxPath)) {
								try {
									const mdxContent = fs.readFileSync(mdxPath, 'utf-8')
									// Simple regex to grab title from frontmatter
									// Matches: title: "Start of Project" or title: Start of Project
									const titleMatch = mdxContent.match(/^title:\s*(?:["'](.+)["']|(.+))$/m)
									if (titleMatch) {
										title = (titleMatch[1] || titleMatch[2]).trim()
										break // Found it, stop looking
									}
								} catch (e) {
									// ignore read errors
								}
							}
						}
					}

					items.push({
						id: relativePath.replace(/\\/g, '/'), // normalization
						filePath: metaPath,
						collection, // 'notes' or 'devlog' inherited from root scan
						...json,
						title: title || json.title, // Use extracted title if available
						series: seriesId, // Inferred!
					})
				} catch (e) {
					console.error(`Error parsing ${metaPath}`, e)
				}
			}

			// Continue recursion
			getRecursiveFiles(fullPath, collection, items)
		}
	}
	return items
}

export const GET: APIRoute = async () => {
	const notesItems = getRecursiveFiles(path.join(CONTENT_DIR, 'notes'), 'notes')
	const devlogItems = getRecursiveFiles(path.join(CONTENT_DIR, 'devlog'), 'devlog')

	// Sort by new (optional, client does it too)
	const allItems = [...notesItems, ...devlogItems]

	return new Response(JSON.stringify(allItems), {
		headers: { 'Content-Type': 'application/json' },
	})
}
