import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'src', 'content')

// Collections to normalize
const COLLECTIONS = [
	{ name: 'til', isNested: false }, // Flat: til/slug/
	{ name: 'devlog', isNested: true }, // Nested: devlog/series/slug/
]

// Fields to centralize in meta.json

// Fields that are DEFINITELY common data:
const COMMON_DATA_FIELDS = [
	'pubDate',
	'updatedDate',
	'draft',
	'tags',
	'heroImage',
	'ogImage',
	'series', // The series ID usually
	'new',
]

// Regex to capture frontmatter
const FRONTMATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/

function getDirectories(srcPath) {
	if (!fs.existsSync(srcPath)) return []
	return fs.readdirSync(srcPath).filter((file) => {
		return fs.statSync(path.join(srcPath, file)).isDirectory()
	})
}

function parseFrontmatter(content) {
	const match = content.match(FRONTMATTER_REGEX)
	if (!match) return null

	const frontmatter = match[1]
	const data = {}

	frontmatter.split('\n').forEach((line) => {
		const parts = line.split(':')
		if (parts.length >= 2) {
			const key = parts[0].trim()
			let value = parts.slice(1).join(':').trim()

			// Remove quotes
			if (value.startsWith('"') && value.endsWith('"')) {
				value = value.slice(1, -1)
			} else if (value.startsWith("'") && value.endsWith("'")) {
				value = value.slice(1, -1)
			}

			// Handle booleans
			if (value === 'true') value = true
			if (value === 'false') value = false

			// Handle array format ["tag1", "tag2"]
			if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
				try {
					const validJson = value.replace(/'/g, '"')
					data[key] = JSON.parse(validJson)
				} catch (_e) {
					data[key] = value
						.slice(1, -1)
						.split(',')
						.map((s) => s.trim().replace(/['"]/g, ''))
				}
			} else {
				data[key] = value
			}
		}
	})

	return data
}

function removeMetadataFromContent(content, keysToRemove) {
	return content.replace(FRONTMATTER_REGEX, (_, frontmatter) => {
		const lines = frontmatter.split('\n').filter((line) => {
			// Handle "key: value"
			const key = line.split(':')[0].trim()
			// Simplify logic: if line starts with key and is followed by colon
			// But be careful with comments or other YAML.
			// This is a simple regex-based parser, might be fragile but works for this project's style.
			return !keysToRemove.includes(key)
		})
		// Reconstruct frontmatter
		return `---\n${lines.join('\n')}\n---`
	})
}

async function normalizeCollection(collectionName, isNested) {
	console.log(`🧹 Normalizing ${collectionName} metadata...`)
	const collectionRoot = path.join(CONTENT_ROOT, collectionName)

	// Helper to process a specific directory (where meta.json should live)
	const processDir = (dirPath) => {
		const metaPath = path.join(dirPath, 'meta.json')
		const esPath = path.join(dirPath, 'es.mdx')

		let metaData = {}
		let esData = {}

		// 1. Load or Initialize meta.json
		if (fs.existsSync(metaPath)) {
			try {
				metaData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
			} catch (_e) {
				console.error(`❌ Error parsing ${metaPath}:`, e.message)
				return
			}
		}

		// 2. Load ES content to extract missing data (Source of Truth for migration)
		if (fs.existsSync(esPath)) {
			const esContent = fs.readFileSync(esPath, 'utf-8')
			esData = parseFrontmatter(esContent) || {}
		}

		// 3. Merge Strategy: meta.json wins, fallback to esData for COMMON fields
		const updates = {}
		COMMON_DATA_FIELDS.forEach((field) => {
			const finalValue = metaData[field] !== undefined ? metaData[field] : esData[field]
			if (finalValue !== undefined) {
				updates[field] = finalValue
			}
		})

		// Update meta.json object
		Object.assign(metaData, updates)

		// Only write if we have keys (don't create empty json if no fields found)
		if (Object.keys(metaData).length > 0) {
			fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2))
			// console.log(`✅ Verified meta.json for ${path.relative(CONTENT_ROOT, dirPath)}`);
		}

		// 4. Clean MDX files (ES, EN, CA)
		;['es.mdx', 'en.mdx', 'ca.mdx'].forEach((langFile) => {
			const filePath = path.join(dirPath, langFile)
			if (fs.existsSync(filePath)) {
				let content = fs.readFileSync(filePath, 'utf-8')
				// Remove the common fields we moved to meta.json
				const cleanContent = removeMetadataFromContent(content, COMMON_DATA_FIELDS)

				if (content !== cleanContent) {
					fs.writeFileSync(filePath, cleanContent)
					console.log(`   Refined ${path.relative(CONTENT_ROOT, filePath)}`)
				}
			}
		})
	}

	if (isNested) {
		// e.g. blog/series/part-1
		const seriesDirs = getDirectories(collectionRoot)
		for (const series of seriesDirs) {
			const seriesPath = path.join(collectionRoot, series)
			const partDirs = getDirectories(seriesPath)
			for (const part of partDirs) {
				processDir(path.join(seriesPath, part))
			}
		}
	} else {
		// e.g. til/slug
		const dirs = getDirectories(collectionRoot)
		for (const dir of dirs) {
			processDir(path.join(collectionRoot, dir))
		}
	}
}

async function main() {
	for (const col of COLLECTIONS) {
		await normalizeCollection(col.name, col.isNested)
	}
	console.log('✨ All content normalized!')
}

main()
