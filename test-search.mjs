import * as pagefind from './dist/pagefind/pagefind.js'

async function run() {
	const result = await pagefind.search('stardraw');
	for (const res of result.results) {
		const data = await res.data();
		console.log('Result URL:', data.url, 'Type:', data.filters?.type);
	}
}

run();
