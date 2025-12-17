import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'src', 'content')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function main() {
	console.clear()
	console.log('\x1b[36m%s\x1b[0m', '🏷️  Gestor de Badge "NEW"')
	console.log('\x1b[90m%s\x1b[0m', '================================')

	// 1. Select Collection
	console.log('1) Devlog')
	console.log('2) TIL')
	const collectionInput = await question('Selecciona colección (1-2): ')
	const collection = collectionInput.trim() === '1' ? 'devlog' : 'til'

	// 2. Select Dates (Day/Month for current year)
	console.log('\n📅 Configuración de Fechas (Año Actual)')
	console.log('   - Dejar VACÍO (Enter) para ignorar ese límite.\n')

    const currentYear = new Date().getFullYear()

    const askDate = async (label) => {
        console.log(`\x1b[36m${label}\x1b[0m`)
        const d = await question('   Día: ')
        if (!d.trim()) return null
        const m = await question('   Mes: ')
        if (!m.trim()) return null // Require both if day is present? Or assume?
        
        const day = parseInt(d.trim())
        const month = parseInt(m.trim())

        if (isNaN(day) || isNaN(month)) return null
        return new Date(currentYear, month - 1, day)
    }

	const dateBefore = await askDate('� Hasta (Fecha Fin/Anterior):') // Upper Limit
    if (dateBefore) console.log(`   [Límite Superior: ${dateBefore.toLocaleDateString()}]\n`)

	const dateAfter = await askDate('� A partir de (Fecha Inicio/Posterior):') // Lower Limit
    if (dateAfter) console.log(`   [Límite Inferior: ${dateAfter.toLocaleDateString()}]\n`)

    if (!dateAfter && !dateBefore) {
        console.error('❌ Debes seleccionar al menos una fecha límite.')
        rl.close()
        return
    }

	// 3. Find and Update
	console.log(`\n🔍 Buscando en ${collection}...`)
	const rootDir = path.join(CONTENT_ROOT, collection)
	
	if (!fs.existsSync(rootDir)) {
		console.error(`❌ No existe el directorio: ${rootDir}`)
		rl.close()
		return
	}

	const files = findMetaFiles(rootDir)
	let updatedCount = 0

	for (const metaPath of files) {
		try {
			const content = fs.readFileSync(metaPath, 'utf-8')
			const json = JSON.parse(content)
			
			if (!json.pubDate) continue

			const pubDate = new Date(json.pubDate)
			let shouldUpdate = true

			// Logic
			// If dateBefore is set, pubDate must be <= dateBefore
			if (dateBefore && pubDate > dateBefore) shouldUpdate = false
			
			// If dateAfter is set, pubDate must be >= dateAfter
			if (dateAfter && pubDate < dateAfter) shouldUpdate = false

			if (shouldUpdate) {
				if (!json.new) {
					json.new = true
					fs.writeFileSync(metaPath, JSON.stringify(json, null, 2))
					console.log(`✅ Marcado como NEW: ${path.relative(CONTENT_ROOT, metaPath)} (${json.pubDate})`)
					updatedCount++
				}
			} else {
				// Cleanup: If outside range and currently marked NEW, remove it.
				if (json.new) {
					delete json.new
					fs.writeFileSync(metaPath, JSON.stringify(json, null, 2))
					console.log(`🧹 Limpiado NEW: ${path.relative(CONTENT_ROOT, metaPath)} (${json.pubDate})`)
					updatedCount++
				}
			}
		} catch (e) {
			console.error(`Error procesando ${metaPath}:`, e.message)
		}
	}

	console.log(`\n✨ Proceso completado. ${updatedCount} archivos actualizados.`)
	rl.close()
}

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

main()
