import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'devlog')

// Helper to recursively find meta.json files
function findMetaFiles(dir, fileList = []) {
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

// Main verification
async function verify() {
	console.log('🔍 Verificando fechas de series en DevLogs...')

	if (!fs.existsSync(CONTENT_DIR)) {
		console.error(`❌ No se encontró el directorio: ${CONTENT_DIR}`)
		process.exit(1)
	}

	const metaFiles = findMetaFiles(CONTENT_DIR)
	// Group by "series folder"
	// Structure: .../blog/series-name/part-X/meta.json
	// Key: series-name
	const seriesMap = {}

	metaFiles.forEach((metaPath) => {
		// Get relative path from CONTENT_DIR
		const relative = path.relative(CONTENT_DIR, metaPath)
		const parts = relative.split(path.sep)

		// Check if it looks like a part (parent folder is part-N)
		// parts: ['stardraw', 'part-1', 'meta.json']
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

					if (json.pubDate) {
						seriesMap[seriesFolder].push({
							partNumber: parseInt(match[1], 10),
							date: new Date(json.pubDate),
							path: metaPath,
							PartFolder: partFolder,
						})
					}
				} catch (e) {
					console.warn(`⚠️ Error leyendo ${metaPath}:`, e.message)
				}
			}
		}
	})

	let hasError = false

	for (const [series, items] of Object.entries(seriesMap)) {
		// Sort by part number
		items.sort((a, b) => a.partNumber - b.partNumber)

		// Check dates
		if (items.length > 1) {
			console.log(`📂 Revisando serie: ${series} (${items.length} partes)`)

			for (let i = 0; i < items.length - 1; i++) {
				const current = items[i]
				const next = items[i + 1]

				if (current.date >= next.date) {
					console.error(`❌ ERROR en ${series}:`)
					console.error(`   ${current.PartFolder} (${current.date.toISOString()}) NO es anterior a`)
					console.error(`   ${next.PartFolder} (${next.date.toISOString()})`)
					hasError = true
				} else {
					console.log(`   ✅ ${current.PartFolder} -> ${next.PartFolder} ok`)
				}
			}
		}
	}

	if (hasError) {
		console.error(
			'\n🔴 Verificación fallida: Se encontraron inconsistencias en las fechas de las series.',
		)
		process.exit(1)
	} else {
		console.log('\n✅ Todas las series verificadas correctamente.')
		process.exit(0)
	}
}

verify()
