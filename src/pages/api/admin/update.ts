import type { APIRoute } from 'astro'
import fs from 'fs'
import path from 'path'

// export const prerender = false // Disabled for static build consistency

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json()
		const { updates } = body // Expecting { updates: [{ filePath, data }] }

		if (!Array.isArray(updates)) {
			return new Response(JSON.stringify({ error: 'Invalid payload format' }), { status: 400 })
		}

		const results = updates.map((update: any) => {
			const { filePath, ...fieldsToUpdate } = update

			if (!fs.existsSync(filePath)) {
				return { filePath, status: 'error', message: 'File not found' }
			}

			const currentContent = fs.readFileSync(filePath, 'utf-8')
			let json = JSON.parse(currentContent)

			// Separate title from other metadata
			const { title, ...otherFields } = fieldsToUpdate

			// 1. Update MDX Frontmatter if title is present
			if (title !== undefined) {
				const dir = path.dirname(filePath)
				const potentialMdxFiles = ['es.mdx', 'index.mdx', 'en.mdx']

				for (const mdxFile of potentialMdxFiles) {
					const mdxPath = path.join(dir, mdxFile)
					if (fs.existsSync(mdxPath)) {
						let mdxContent = fs.readFileSync(mdxPath, 'utf-8')
						// Regex to replace title in frontmatter
						// Looks for title: "Something" or title: Something
						const titleRegex = /^(title:\s*)(?:["']?)(.*?)(?:["']?)(\s*)$/m
						const match = mdxContent.match(titleRegex)

						let needsUpdate = true
						if (match) {
							const currentTitle = match[2] // Captured group 2 is the title value
							// Compare ignoring outer quotes logic if regex kept them, but here group 2 is content
							if (currentTitle === title) {
								needsUpdate = false
							}
						}

						if (needsUpdate && titleRegex.test(mdxContent)) {
							// Use JSON.stringify to ensure it's a valid quoted string (escaped quotes, etc.)
							// $1 is the key "title: ", $3 is the trailing space/newline
							mdxContent = mdxContent.replace(titleRegex, `$1${JSON.stringify(title)}$3`)
							fs.writeFileSync(mdxPath, mdxContent)
						} else if (!needsUpdate) {
							// Title matched, do nothing to MDX
						} else {
							// If title prop doesn't exist but it is an MDX with frontmatter, maybe append it?
							// For now, let's assume standard frontmatter exists.
							// Use 'updatedDate' as anchor or just inserting after ---
							// Safer to just skip if not found to avoid breaking file,
							// but practically all our files have title.
						}
						break // Update only the first priority match (usually 'es.mdx')
					}
				}

				// Also update meta.json if it already has a title field, to keep strict sync?
				// Architecture says title belongs in MDX.
				// If meta.json has 'title', we should probably update it too to avoid conflicts.
				if (json.title) {
					json.title = title
				}
			}

			// 2. Update meta.json with other fields (and title if it was there)
			const newJson = { ...json, ...otherFields }
			// If meta.json didn't have title, and we updated MDX, we don't add title to meta.json. Only if it was there.
			if (!json.title && title !== undefined) {
				// Ensure we don't accidentally add it
				delete newJson.title
			}

			fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2))
			return { filePath, status: 'success' }
		})

		return new Response(JSON.stringify({ success: true, results }), {
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (e) {
		return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 })
	}
}
