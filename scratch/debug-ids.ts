import { getCollection } from 'astro:content';

async function debug() {
    try {
        const posts = await getCollection('devlogs');
        console.log('--- DEBUG DEVLOGS IDs ---');
        posts.slice(0, 5).forEach(p => {
            console.log(`ID: "${p.id}", slug: "${(p as any).slug}"`);
        });
    } catch (e) {
        console.error('Error fetching collection:', e);
    }
}

debug();
