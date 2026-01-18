import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'src', 'content')

// Collections to process
const COLLECTIONS = [
	{ name: 'notes', isNested: false }, // notes/slug/es.mdx
	{ name: 'devlogs', isNested: true }, // devlogs/series/slug/es.mdx
]

// Fields that should be synced from Main Language (ES) to others
const SYNC_FIELDS = [
    // 'title', // Localized
    // 'description', // Localized
	'pubDate',
	'updatedDate',
	'draft',
	'tags',
	'heroImage',
	'ogImage',
	'series',     // ID of the series
	// 'seriesTitle', // Localized
    // 'seriesDescription', // Localized
	'new',
	'end',
	'icon'
]

// Regex to capture frontmatter
const FRONTMATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/

function getDirectories(srcPath) {
	if (!fs.existsSync(srcPath)) return []
	return fs.readdirSync(srcPath).filter((file) => {
		return fs.statSync(path.join(srcPath, file)).isDirectory()
	})
}

// Simple YAML-like parser (Robust enough for this project's flat structures)
function parseFrontmatter(content) {
	const match = content.match(FRONTMATTER_REGEX)
	if (!match) return {}

	const frontmatter = match[1]
	const data = {}

	frontmatter.split('\n').forEach((line) => {
		const parts = line.split(':')
		if (parts.length >= 2) {
			const key = parts[0].trim()
			// Handle values that might contain colons (like URLs or times)
			let value = parts.slice(1).join(':').trim()

			// Remove quotes and unescape
			if (value.startsWith('"') && value.endsWith('"')) {
				// Unescape: handle both \" and \\" patterns
				value = value.slice(1, -1)
					.replace(/\\\\"/g, '"')  // \\" -> "
					.replace(/\\"/g, '"')    // \" -> "
			} else if (value.startsWith("'") && value.endsWith("'")) {
				value = value.slice(1, -1)
			}

			// Handle booleans
			if (value === 'true') data[key] = true
			else if (value === 'false') data[key] = false
			// Handle arrays
			else if (value.startsWith('[') && value.endsWith(']')) {
				try {
					// transform single quotes to double for JSON parse
					const validJson = value.replace(/'/g, '"')
					data[key] = JSON.parse(validJson)
				} catch (e) {
					// Fallback manual parse
					data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''))
				}
			} 
			else if (value.startsWith('{') && value.endsWith('}')) {
				try {
					data[key] = JSON.parse(value)
				} catch (e) {
					data[key] = value
				}
			}
            // Handle Dates - Keep as string to preserve format in file
            else {
				data[key] = value
			}
		}
	})
	return data
}

function stringifyFrontmatter(data, originalContent) {
    // Orden preferido de campos en el frontmatter
    const FIELD_ORDER = [
        'pubDate',
        'updatedDate',
        'tags',
        'heroImage',
        'ogImage',
        'icon',
        'draft',
        'new',
        'end',
        'title',
        'description',
        'series',
        'seriesTitle',
        'seriesDescription',
        'lang',
    ]
    
    // Ordenar keys: primero los del orden predefinido, luego el resto alfabéticamente
    const allKeys = Object.keys(data)
    const orderedKeys = FIELD_ORDER.filter(k => allKeys.includes(k))
    const remainingKeys = allKeys.filter(k => !FIELD_ORDER.includes(k)).sort()
    const keys = [...orderedKeys, ...remainingKeys]
    
    let yaml = '---\n'
    
    for (const key of keys) {
        const value = data[key]
        if (value === undefined) continue

        if (Array.isArray(value)) {
            // format: key: ['val1', 'val2']
            const arrayStr = `[${value.map(v => `'${v}'`).join(', ')}]`
            yaml += `${key}: ${arrayStr}\n`
        } else if (typeof value === 'string') {
            // Check if needs quotes
            if (value.includes(':') || value.includes('#') || value === '' || value.includes("'")) {
                 // If value contains apostrophes, use double quotes
                 if (value.includes("'")) {
                     yaml += `${key}: "${value.replace(/"/g, '\\"')}"\n`
                 } else {
                     yaml += `${key}: '${value}'\n`
                 }
            } else {
                yaml += `${key}: ${value}\n`
            }
        } else if (typeof value === 'object' && value !== null) {
            // It's a nested object (e.g. seriesTitle: {es: '...', en: '...'})
             // We can use JSON stringify but maybe we want proper YAML indentation?
             // For simplicity/robustness in frontmatter, JSON syntax is valid YAML 1.2
             yaml += `${key}: ${JSON.stringify(value)}\n`
        } else {
            yaml += `${key}: ${value}\n`
        }
    }
    yaml += '---\n'
    
    // Append body
    const match = originalContent.match(FRONTMATTER_REGEX)
    const body = match ? originalContent.replace(match[0], '').trim() : originalContent.trim()
    
    return yaml + (body ? '\n' + body + '\n' : '')
}

function updateFrontmatter(content, updates) {
    const currentData = parseFrontmatter(content)
    const newData = { ...currentData, ...updates }
    return stringifyFrontmatter(newData, content)
}

function processDirectory(dirPath) {
    const metaPath = path.join(dirPath, 'meta.json')
    const esPath = path.join(dirPath, 'es.mdx')
    
    // 1. DATA MIGRATION (meta.json -> es.mdx)
    let commonData = {}
    
    if (fs.existsSync(metaPath)) {
        console.log(`📦 Importando meta.json en: ${path.relative(CONTENT_ROOT, dirPath)}`)
        try {
            const metaContent = fs.readFileSync(metaPath, 'utf-8')
            const metaJson = JSON.parse(metaContent)
            commonData = { ...metaJson }
            
            // Delete meta.json after reading
            fs.unlinkSync(metaPath)
        } catch (e) {
            console.error(`Error reading meta.json: ${e.message}`)
        }
    }

    // 2. READ MAIN FILE (Source of Truth)
    if (fs.existsSync(esPath)) {
        const esContent = fs.readFileSync(esPath, 'utf-8')
        // If we migrated data, we need to save it to es.mdx FIRST
        if (Object.keys(commonData).length > 0) {
            const updatedEsContent = updateFrontmatter(esContent, commonData)
            fs.writeFileSync(esPath, updatedEsContent)
            // Update commonData with the full picture from the file (in case meta.json was partial)
            commonData = { ...parseFrontmatter(updatedEsContent) }
        } else {
            // Just read what's there
            commonData = parseFrontmatter(esContent)
            
            // FORCE REFORMAT (Temporary)
            const sortedEsContent = stringifyFrontmatter(commonData, esContent)
            if (sortedEsContent !== esContent) {
                fs.writeFileSync(esPath, sortedEsContent)
                console.log(`Formatted ${path.relative(CONTENT_ROOT, esPath)}`)
            }
        }
    } else {
        // No ES file? Skip syncing (nothing to sync from)
        return
    }

    // 3. SYNC TO OTHERS
    const others = ['en.mdx', 'ca.mdx']
    for (const file of others) {
        const filePath = path.join(dirPath, file)
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8')
            
            // Extract only SYNC_FIELDS from commonData
            const updates = {}
            SYNC_FIELDS.forEach(field => {
                if (commonData[field] !== undefined) {
                    updates[field] = commonData[field]
                }
            })
            
            // Special handling for seriesTitle if it's an object in commonData (localized)
            // If it is an object, we DON'T sync it as a flat string, we might need to pick the right lang
            // But usually 'seriesTitle' in frontmatter is a string. 
            // If meta.json had it as object {es, en}, we probably want to map it?
            // For now, simple copy. If commonData has a string, it copies. 
            
            const newContent = updateFrontmatter(content, updates)
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent)
                console.log(`   🔄 Sincronizado: ${file}`)
            }
        }
    }
}

async function run() {
    console.log('🔄 Iniciando sincronización de contenido (Master: ES)...')
    
    for (const col of COLLECTIONS) {
        const colRoot = path.join(CONTENT_ROOT, col.name)
        if (!fs.existsSync(colRoot)) continue

        if (col.isNested) {
            const seriesDirs = getDirectories(colRoot)
            for (const series of seriesDirs) {
                const seriesPath = path.join(colRoot, series)
                const partDirs = getDirectories(seriesPath)
                for (const part of partDirs) {
                    processDirectory(path.join(seriesPath, part))
                }
            }
        } else {
            const dirs = getDirectories(colRoot)
            for (const dir of dirs) {
                processDirectory(path.join(colRoot, dir))
            }
        }
    }
    console.log('✅ Sincronización completada.')
}

run()
