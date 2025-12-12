import { getCollection, type CollectionEntry } from 'astro:content'

export type BlogPost = CollectionEntry<'blog'> & {
	data: CollectionEntry<'blog'>['data'] & {
		pubDate: Date
		tags: string[]
	}
}

// Load all meta.json files at build time
// Matches src/content/blog/series/post/meta.json
const metaFiles = import.meta.glob('../content/blog/**/meta.json', { eager: true, import: 'default' })

export async function getBlogPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog', ({ id, data }) => {
		return import.meta.env.PROD ? data.draft !== true : true
	})
	
	return posts
		.map((post) => {
			// post.id is like "stardraw/part-1/es.mdx"
			// we want "stardraw/part-1"
			// post.id is like "stardraw/part-1/es.mdx"
			// we want "stardraw/part-1"
            const parts = post.id.split(/[/\\]/)
            parts.pop() // remove filename (es.mdx)
            const folder = parts.join('/')
            
            // Robust lookup: find key that ends with "folder/meta.json"
            const metaKey = Object.keys(metaFiles).find(key => key.endsWith(`/${folder}/meta.json`))
            const meta = metaKey ? (metaFiles[metaKey] as { pubDate?: string; updatedDate?: string; tags?: string[] } | undefined) : undefined

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

            if (!pubDate) {
                pubDate = new Date(0) // Default to epoch to avoid crash
            }

            // Create new data object
            const newData = {
                ...post.data,
                pubDate, // inferred as Date | undefined
                tags,    // inferred as string[]
            }
            
            // updatedDate is optional in schema, add only if exists
            if (updatedDate) {
                newData.updatedDate = updatedDate
            }

			return {
				...post,
				data: newData,
			} as unknown as BlogPost // Cast effectively after validation
		})
        // Filter out posts that still don't have a date (legacy or missing meta)
        // If frontmatter had it, it's kept. If meta had it, it's used.
		.filter((post): post is BlogPost => post.data.pubDate !== undefined && post.data.pubDate !== null)
}
