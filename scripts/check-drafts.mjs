import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../src/content')
const collections = ['devlogs', 'notes']

console.log('🔍 Buscando contenido en borrador (draft: true)...\n')

let foundDrafts = 0

function checkDirectory(dir) {
	if (!fs.existsSync(dir)) return

	const items = fs.readdirSync(dir, { withFileTypes: true })

	for (const item of items) {
		const fullPath = path.join(dir, item.name)

		if (item.isDirectory()) {
			// Recurse
			checkDirectory(fullPath)
		} else if (item.isFile()) {
			const ext = path.extname(item.name).toLowerCase()
			const relativePath = path.relative(contentDir, fullPath)

			// Check MD/MDX frontmatter
			if (ext === '.md' || ext === '.mdx') {
				try {
					const content = fs.readFileSync(fullPath, 'utf-8')
					// Simple frontmatter extraction
					const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
					if (match && match[1]) {
						const frontmatter = match[1]
						// Check for draft: true in YAML (simple regex)
						if (/^draft:\s*true/m.test(frontmatter)) {
							console.log(`📝 [DRAFT] ${relativePath}`)
							foundDrafts++
						}
					}
				} catch (e) {
					console.error(`❌ Error reading ${item.name}:`, e.message)
				}
			}
		}
	}
}

for (const collection of collections) {
	checkDirectory(path.join(contentDir, collection))
}

console.log(`\n✨ Finalizado. Se han encontrado ${foundDrafts} borradores.`)
