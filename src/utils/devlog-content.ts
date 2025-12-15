import { getCollection, type CollectionEntry } from 'astro:content'

export type DevlogPost = CollectionEntry<'devlog'> & {
	data: CollectionEntry<'devlog'>['data'] & {
		pubDate: Date
		tags: string[]
		end?: boolean
        seriesCount?: number
        newSlugs?: string[]
        allSlugs?: string[]
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
							end?: boolean
                            seriesTitle?: string
                            series?: string
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

				// Validate and merge tags
				const frontmatterTags = post.data.tags || []
				const metaTags = meta?.tags || []
				// Merge uniquing tags
				let tags: string[] = Array.from(new Set([...metaTags, ...frontmatterTags]))

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
					series: meta?.series || post.data.series || (parts.length > 0 ? parts[0] : undefined),
                    seriesTitle: meta?.seriesTitle || post.data.seriesTitle,
					new: meta?.new ?? post.data.new,
					end: meta?.end !== undefined ? meta.end : post.data.end
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
			.filter((post) => !post.id.endsWith('.json'))
			.filter(
				(post): post is DevlogPost => post.data.pubDate !== undefined && post.data.pubDate !== null,
			)
			.filter((post) => (import.meta.env.PROD ? post.data.draft !== true : true))
	)
}

export function groupDevlogsBySeries(posts: DevlogPost[]): DevlogPost[] {
	const seriesMap = new Map<string, DevlogPost[]>()
	const soloPosts: DevlogPost[] = []

	for (const post of posts) {
		if (post.data.series) {
			const list = seriesMap.get(post.data.series) || []
			list.push(post)
			seriesMap.set(post.data.series, list)
		} else {
            // Solo posts count as series of 1 for badge logic
            const entry: DevlogPost = {
                ...post,
                data: {
                    ...post.data,
                    seriesCount: 1,
                    newSlugs: post.data.new ? [post.slug] : []
                }
            }
			soloPosts.push(entry)
		}
	}

	const finalSeriesPosts = Array.from(seriesMap.values()).map((list) => {
		list.sort((a: DevlogPost, b: DevlogPost) => {
			if (!a.data.pubDate || !b.data.pubDate) return 0
			return a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
		})

		const part1 = list[0]
		const latestPart = list[list.length - 1]
        
        // Check if ANY part in the series is marked as new
        const hasNewContent = list.some(p => p.data.new)

		const entry: DevlogPost = {
			...part1,
			data: {
				...part1.data,
				pubDate: latestPart.data.pubDate,
                new: hasNewContent,
				seriesCount: list.length,
				newSlugs: list.filter((p) => p.data.new).map((p) => p.slug),
                allSlugs: list.map((p) => p.slug)
			},
		}
		return entry
	})

	return [...soloPosts, ...finalSeriesPosts].sort((a, b) => {
		if (!a.data.pubDate || !b.data.pubDate) return 0
		return b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	})
}
