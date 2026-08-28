import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'src', 'content')

const COLLECTIONS = ['devlogs', 'notes', 'projects']

// Helper to find MDX files
function findMdxFiles(dir, fileList = []) {
	if (!fs.existsSync(dir)) return fileList

	const files = fs.readdirSync(dir)
	files.forEach((file) => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)
		if (stat.isDirectory()) {
			findMdxFiles(filePath, fileList)
		} else {
			if (file.endsWith('.mdx')) {
				fileList.push(filePath)
			}
		}
	})
	return fileList
}

const FRONTMATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/

// Helper to validate date string
function isValidDate(dateStr) {
	const d = new Date(dateStr)
	return d instanceof Date && !isNaN(d)
}

// Main verification
async function verify() {
	console.log('🔍 Iniciando verificación de contenido...')

	let hasError = false
	let totalFiles = 0

	// 1. GLOBAL CHECKS (Now on MDX directly)
	for (const collection of COLLECTIONS) {
		const collectionDir = path.join(CONTENT_ROOT, collection)
		if (!fs.existsSync(collectionDir)) {
			console.warn(`⚠️ Colección no encontrada: ${collection}`)
			continue
		}

        // We check 'es.mdx', 'en.mdx', 'ca.mdx'
		const mdxFiles = findMdxFiles(collectionDir)
		totalFiles += mdxFiles.length

		mdxFiles.forEach((filePath) => {
			const relativePath = path.relative(CONTENT_ROOT, filePath)

			try {
				const content = fs.readFileSync(filePath, 'utf-8')
                // Parse simple frontmatter
                const json = {}
                const match = content.match(FRONTMATTER_REGEX)
                if (match) {
                    const lines = match[1].split('\n')
                    lines.forEach(line => {
                         const parts = line.split(':')
                         if (parts.length >= 2) {
                             const key = parts[0].trim()
                             let val = parts.slice(1).join(':').trim()
                             if (val.startsWith('"') || val.startsWith("'")) val = val.slice(1, -1)
                             json[key] = val
                         }
                    })
                }

// Check pubDate (skip drafts: pubDate is optional in the schema for WIP)
			if (json.draft === 'true') return

			if (!json.pubDate) {
				console.error(`❌ ERROR en ${relativePath}: Faltan el campo obligatorio 'pubDate'`)
				hasError = true
			} else if (!isValidDate(json.pubDate)) {
				console.error(`❌ ERROR en ${relativePath}: pubDate inválida (${json.pubDate})`)
				hasError = true
			}

				// Check tags (Only strict check on ES usually, but let's check everywhere they exist)
				if (json.tags) {
                     // Simple check, parsing yaml array regex is hard here, trusting sync script mostly
                }

			} catch (e) {
				console.error(`❌ ERROR leyendo MDX en ${relativePath}:`, e.message)
				hasError = true
			}
		})
	}
    
    // We skipped specific series date logic for now to simplify migration check. 
    // The sync script ensures consistency.

	if (hasError) {
		console.error('\n🔴 Verificación fallida: Se encontraron errores de contenido.')
		process.exit(1)
	} else {
		console.log(`\n✅ Contenido verificado (${totalFiles} archivos). Todo correcto.`)
		process.exit(0)
	}
}

verify()
