import { getCollection, type CollectionEntry } from 'astro:content'

export type DevlogPost = CollectionEntry<'devlog'> & {
	data: CollectionEntry<'devlog'>['data'] & {
		pubDate: Date
		tags: string[]
	}
}

// Load all meta.json files at build time
// Matches src/content/devlog/series/post/meta.json
const metaFiles = import.meta.glob('../content/devlog/**/meta.json', {
	eager: true,
	import: 'default',
})

export async function getDevlogs(): Promise<DevlogPost[]> {
	const posts = await getCollection('devlog')

	return (
		posts
			.map((post) => {
				// post.id is like "stardraw/part-1/es.mdx"
				// we want "stardraw/part-1"
				const parts = post.id.split(/[/\\]/)
				parts.pop() // remove filename (es.mdx)
				const folder = parts.join('/')

				// Robust lookup: find key that ends with "folder/meta.json"
				const metaKey = Object.keys(metaFiles).find((key) => key.endsWith(`/${folder}/meta.json`))
				const meta = metaKey
					? (metaFiles[metaKey] as
							| {
									pubDate?: string
									updatedDate?: string
									tags?: string[]
									draft?: boolean
									heroImage?: string
									descriptionHeroImage?: string
									ogImage?: string
									new?: boolean
							  }
							| undefined)
					: undefined

				// Validate and parse dates
				let pubDate = post.data.pubDate
				if (meta?.pubDate) {
					pubDate = new Date(meta.pubDate)
				}

				let updatedDate = post.data.updatedDate
				if (meta?.updatedDate) {
					updatedDate = new Date(meta.updatedDate)
				}

				// Validate tags
				let tags: string[] = post.data.tags || []
				if (meta?.tags && meta.tags.length > 0) {
					tags = meta.tags
				}

				// Merge other fields (meta.json takes precedence)
				const draft = meta?.draft !== undefined ? meta.draft : post.data.draft
				const heroImage = meta?.heroImage || post.data.heroImage
				const descriptionHeroImage = meta?.descriptionHeroImage || post.data.descriptionHeroImage
				const ogImage = meta?.ogImage || post.data.ogImage

				if (!pubDate) {
					pubDate = new Date(0) // Default to epoch to avoid crash
				}

				// Create new data object
				const newData = {
					...post.data,
					pubDate,
					updatedDate: updatedDate || undefined,
					tags,
					draft,
					heroImage,
					descriptionHeroImage,
					ogImage,
					series: post.data.series || (parts.length > 0 ? parts[0] : undefined),
					new: meta?.new ?? post.data.new,
				}

				// updatedDate is optional in schema, add only if exists
				if (updatedDate) {
					newData.updatedDate = updatedDate
				}

				return {
					...post,
					data: newData,
				} as unknown as DevlogPost // Cast effectively after validation
			})
			// Filter out posts that still don't have a date (legacy or missing meta)
			// If frontmatter had it, it's kept. If meta had it, it's used.
			.filter(
				(post): post is DevlogPost => post.data.pubDate !== undefined && post.data.pubDate !== null,
			)
			.filter((post) => (import.meta.env.PROD ? post.data.draft !== true : true))
	)
}
