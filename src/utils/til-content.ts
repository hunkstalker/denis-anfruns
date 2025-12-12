import { getCollection, type CollectionEntry } from 'astro:content'

export type TilPost = CollectionEntry<'til'> & {
	data: CollectionEntry<'til'>['data'] & {
		pubDate: Date
		tags: string[]
	}
}

// Load all meta.json files at build time
const metaFiles = import.meta.glob('../content/til/**/meta.json', { eager: true, import: 'default' })

export async function getTils(): Promise<TilPost[]> {
	const posts = await getCollection('til')
	
	const mapped = posts.map((post) => {
		const folder = post.slug.split('/')[0]
		// Construct the expected path key for the glob result
		const metaKey = `../content/til/${folder}/meta.json`
		const meta = metaFiles[metaKey] as { pubDate?: string; tags?: string[] } | undefined

		// Validar y parsear fecha
		let pubDate: Date | undefined = post.data.pubDate
		if (meta?.pubDate) {
			pubDate = new Date(meta.pubDate)
		}

		// Validar tags
		let tags: string[] = post.data.tags || []
		if (meta?.tags && meta.tags.length > 0) {
			tags = meta.tags
		}

		return {
			...post,
			data: {
				...post.data,
				pubDate,
				tags,
			},
		}
	})

	// Filter out posts that still don't have a date (legacy or missing meta)
	// Then filter out drafts in production
	return mapped
		.filter((post): post is TilPost => 
			post.data.pubDate !== undefined && 
			Array.isArray(post.data.tags)
		)
		.filter((post) => import.meta.env.PROD ? post.data.draft !== true : true)
}
