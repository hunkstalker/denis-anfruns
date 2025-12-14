import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.join(__dirname, '../package.json')

// Descriptions for known scripts to make the menu friendlier
const DESCRIPTIONS = {
	dev: '🚀 Start Development Server',
	'build:preview': '📦 Build -> Preview (Fast)',
	build: '🏗️  Build for Production',
	preview: '👀 Preview Production Build',
	check: '✅ Type Check (Astro)',
	'verify-build-preview': '✨ Full Pipeline: Test (Norm+Ver+Check+Build) -> Preview',
	test: '🧪 Test Build: Normalize -> Verify -> Check -> Build',
	'normalize:content': '🧹 Clean & Normalize Metadata',
	'verify:content': '🔍 Verify Content Integrity',
	'check:drafts': '📝 List Draft Content',
	format: '🎨 Format Code & Sort CSS',
	astro: '⭐ Run generic Astro command',
}

async function main() {
	const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
	const scripts = pkg.scripts || {}

	// Filter out 'start' (alias for dev) and internal scripts if desired,
	// but showing all is safer. We'll skip 'start' as it's redundant.
	const allScripts = Object.keys(scripts).filter((s) => s !== 'start')

	// Define exact order for primary scripts
	const PRIMARY_SCRIPTS = [
		'dev',
		'build:preview',
		'test',
		'verify-build-preview',
		'build',
		'preview',
		'check:drafts',
		'format',
	]

	// Split into primary and secondary
	const primary = PRIMARY_SCRIPTS.filter((s) => allScripts.includes(s))
	const secondary = allScripts.filter((s) => !PRIMARY_SCRIPTS.includes(s))

	// Combine for display mapping
	const scriptNames = [...primary, ...secondary]

	console.clear()
	console.log('\x1b[36m%s\x1b[0m', '🛠️  CLI Menu')
	console.log('\x1b[90m%s\x1b[0m', '================================')

	let counter = 1

	// Print Primary
	primary.forEach((name) => {
		const desc = DESCRIPTIONS[name] || `Run "${name}"`
		const num = (counter++).toString().padStart(2, ' ')
		console.log(`\x1b[33m${num}\x1b[0m) \x1b[1m${name.padEnd(20)}\x1b[0m \x1b[90m- ${desc}\x1b[0m`)
	})

	if (secondary.length > 0) {
		console.log('\x1b[90m%s\x1b[0m', '--------------------------------')

		// Print Secondary
		secondary.forEach((name) => {
			const desc = DESCRIPTIONS[name] || `Run "${name}"`
			const num = (counter++).toString().padStart(2, ' ')
			console.log(
				`\x1b[33m${num}\x1b[0m) \x1b[1m${name.padEnd(20)}\x1b[0m \x1b[90m- ${desc}\x1b[0m`,
			)
		})
	}

	console.log(`\x1b[33m 0\x1b[0m) \x1b[1mExit\x1b[0m`)
	console.log('')

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	rl.question('Select an option (0-' + scriptNames.length + '): ', (answer) => {
		rl.close()
		const choice = parseInt(answer.trim())

		if (isNaN(choice) || choice < 0 || choice > scriptNames.length) {
			console.error('\x1b[31mInvalid option.\x1b[0m')
			process.exit(1)
		}

		if (choice === 0) {
			console.log('Bye! 👋')
			process.exit(0)
		}

		const scriptName = scriptNames[choice - 1]
		const command = scripts[scriptName]

		console.log(`\n\x1b[36mRunning: ${scriptName}\x1b[0m (\x1b[90m${command}\x1b[0m)...\n`)

		// Execute using pnpm to ensure environment is correct
		// Using full command string avoids DEP0190 warning with shell: true
		const child = spawn(`pnpm ${scriptName}`, {
			stdio: 'inherit',
			shell: true,
		})

		child.on('close', (code) => {
			console.log(`\n\x1b[${code === 0 ? '32' : '31'}mProcess exited with code ${code}\x1b[0m`)
		})
	})
}

main()
