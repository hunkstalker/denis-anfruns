import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

const MONACO_SRC = path.join(PROJECT_ROOT, 'node_modules', 'monaco-editor', 'min', 'vs')
const MONACO_DEST = path.join(PROJECT_ROOT, 'public', 'monaco', 'vs')

function dirSize(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).reduce((sum, entry) => {
		const full = path.join(dir, entry.name)
		return sum + (entry.isDirectory() ? dirSize(full) : fs.statSync(full).size)
	}, 0)
}

function countFiles(dir) {
	return fs.readdirSync(dir, { recursive: true }).length
}

function copyMonaco() {
	if (!fs.existsSync(MONACO_SRC)) {
		console.error(`[copy-monaco] No se encontró '${MONACO_SRC}'.`)
		console.error('[copy-monaco] Ejecuta `pnpm install` para instalar monaco-editor.')
		process.exit(1)
	}

	fs.cpSync(MONACO_SRC, MONACO_DEST, { recursive: true })

	const files = countFiles(MONACO_DEST)
	const sizeMb = (dirSize(MONACO_DEST) / 1024 / 1024).toFixed(2)
	console.log(`[copy-monaco] Monaco bundlado en '${MONACO_DEST}' (${files} archivos, ${sizeMb} MB).`)
}

copyMonaco()
