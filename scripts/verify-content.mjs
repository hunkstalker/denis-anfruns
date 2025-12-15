import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'src', 'content')

const COLLECTIONS = ['devlog', 'til', 'projects']

// Helper to recursively find meta.json files
function findMetaFiles(dir, fileList = []) {
	if (!fs.existsSync(dir)) return fileList

	const files = fs.readdirSync(dir)
	files.forEach((file) => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)
		if (stat.isDirectory()) {
			findMetaFiles(filePath, fileList)
		} else {
			if (file === 'meta.json') {
				fileList.push(filePath)
			}
		}
	})
	return fileList
}

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

function parseFrontmatterKeys(content) {
	const match = content.match(FRONTMATTER_REGEX)
	if (!match) return []
	
	const frontmatter = match[1]
	const keys = []
	
	frontmatter.split('\n').forEach(line => {
		const parts = line.split(':')
		if (parts.length >= 2) {
			keys.push(parts[0].trim())
		}
	})
	return keys
}

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

	// 1. GLOBAL CHECKS
	// Iterate over collections
	for (const collection of COLLECTIONS) {
		const collectionDir = path.join(CONTENT_ROOT, collection)
		if (!fs.existsSync(collectionDir)) {
			console.warn(`⚠️ Colección no encontrada: ${collection}`)
			continue
		}

		const metaFiles = findMetaFiles(collectionDir)
		totalFiles += metaFiles.length

		metaFiles.forEach((metaPath) => {
			const relativePath = path.relative(CONTENT_ROOT, metaPath)

			try {
				const content = fs.readFileSync(metaPath, 'utf-8')
				const json = JSON.parse(content)

				// Check pubDate
				if (!json.pubDate) {
					console.error(`❌ ERROR en ${relativePath}: Faltan el campo obligatorio 'pubDate'`)
					hasError = true
				} else if (!isValidDate(json.pubDate)) {
					console.error(`❌ ERROR en ${relativePath}: pubDate inválida (${json.pubDate})`)
					hasError = true
				}

				// Check tags
				if (!json.tags) {
					console.error(`❌ ERROR en ${relativePath}: Faltan el campo obligatorio 'tags'`)
					hasError = true
				} else if (!Array.isArray(json.tags)) {
					console.error(`❌ ERROR en ${relativePath}: 'tags' debe ser un array`)
					hasError = true
				}

				// Check updatedDate
				if (json.updatedDate) {
					if (!isValidDate(json.updatedDate)) {
						console.error(`❌ ERROR en ${relativePath}: updatedDate inválida (${json.updatedDate})`)
						hasError = true
					} else if (json.pubDate && isValidDate(json.pubDate)) {
						const pub = new Date(json.pubDate)
						const upd = new Date(json.updatedDate)
						if (upd < pub) {
							console.error(
								`❌ ERROR en ${relativePath}: updatedDate (${json.updatedDate}) es anterior a pubDate (${json.pubDate})`,
							)
							hasError = true
						}
					}
				}
			} catch (e) {
				console.error(`❌ ERROR leyendo JSON en ${relativePath}:`, e.message)
				hasError = true
			}
		})
	}

	// 2. SERIES CHECKS (Devlog only logic primarily, but applicable if structure exists)
	// Re-use finding logic for devlog collection specifically for series
	const devlogDir = path.join(CONTENT_ROOT, 'devlog')
	if (fs.existsSync(devlogDir)) {
		const metaFiles = findMetaFiles(devlogDir)
		const seriesMap = {}

		metaFiles.forEach((metaPath) => {
			const relative = path.relative(devlogDir, metaPath)
			const parts = relative.split(path.sep)

			// Check if it looks like a part (parent folder is part-N)
			if (parts.length >= 3) {
				const partFolder = parts[parts.length - 2] // part-1
				const seriesFolder = parts.slice(0, parts.length - 2).join('/') // stardraw

				const match = partFolder.match(/^part-(\d+)$/)
				if (match) {
					if (!seriesMap[seriesFolder]) {
						seriesMap[seriesFolder] = []
					}

					try {
						const content = fs.readFileSync(metaPath, 'utf-8')
						const json = JSON.parse(content)

						if (json.pubDate && isValidDate(json.pubDate)) {
							seriesMap[seriesFolder].push({
								partNumber: parseInt(match[1], 10),
								date: new Date(json.pubDate),
								path: metaPath,
								PartFolder: partFolder,
							})
						}
					} catch (_e) {
						// Already handled in global check
					}
				}
			}
		})

		for (const [series, items] of Object.entries(seriesMap)) {
			items.sort((a, b) => a.partNumber - b.partNumber)

			if (items.length > 1) {
				console.log(`📂 Revisando coherencia de serie: ${series}`)
				for (let i = 0; i < items.length - 1; i++) {
					const current = items[i]
					const next = items[i + 1]

					if (current.date >= next.date) {
						console.error(`❌ ERROR de Serie en ${series}:`)
						console.error(
							`   ${current.PartFolder} (${current.date.toISOString()}) NO es anterior a`,
						)
						console.error(`   ${next.PartFolder} (${next.date.toISOString()})`)
						hasError = true
					}
				}
			}
		}
	}

	// 3. MDX PURITY CHECKS (Ensure no duplicate fields)
	// Keys that MUST reside in meta.json if they exist for consistency
	const FORBIDDEN_IN_MDX = ['series', 'seriesTitle', 'seriesDescription', 'draft', 'new', 'icon', 'end']
	
	// Only checking TIL for now as it's the strict one
	const tilDir = path.join(CONTENT_ROOT, 'til')
	if (fs.existsSync(tilDir)) {
		console.log('🧹 Revisando pureza de archivos MDX en TIL...')
		const mdxFiles = findMdxFiles(tilDir)
		
		mdxFiles.forEach(filePath => {
			const relativePath = path.relative(CONTENT_ROOT, filePath)
			const content = fs.readFileSync(filePath, 'utf-8')
			const keys = parseFrontmatterKeys(content)
			
			const foundForbidden = keys.filter(k => FORBIDDEN_IN_MDX.includes(k))
			
			if (foundForbidden.length > 0) {
				console.error(`❌ ERROR en ${relativePath}: Frontmatter sucio.`)
				console.error(`   No debería contener: ${foundForbidden.join(', ')}. (Mover a meta.json)`)
				hasError = true
			}
		})
	}

	if (hasError) {
		console.error('\n🔴 Verificación fallida: Se encontraron errores de contenido.')
		process.exit(1)
	} else {
		console.log(`\n✅ Contenido verificado (${totalFiles} archivos meta.json). Todo correcto.`)
		process.exit(0)
	}
}

verify()
