import { getCollection, type CollectionEntry } from 'astro:content'

export type DevlogPost = CollectionEntry<'devlogs'> & {
	data: CollectionEntry<'devlogs'>['data'] & {
		pubDate: Date
		tags: string[]
		end?: boolean
		seriesCount?: number
		newSlugs?: string[]
		allSlugs?: string[]
	}
}

export async function getDevlogs(): Promise<DevlogPost[]> {
	const posts = await getCollection('devlogs')

	return (
		posts
			.filter((post) => !post.id.endsWith('.json'))
			// Filter posts with valid dates
			.filter(
				(post) => post.data.pubDate !== undefined && post.data.pubDate !== null,
			)
			// Filter drafts in production
			.filter((post) => (import.meta.env.PROD ? post.data.draft !== true : true))
			.map((post) => {
				// Infer series from folder structure if not present
				let series = post.data.series
				if (!series) {
					const parts = post.id.replace(/\\/g, '/').split('/')
					// e.g. stardraw/part-1/es.mdx
					// parts: [stardraw, part-1, es.mdx]
					// Series ID is usually the top folder
					if (parts.length > 2) {
						series = parts[0]
					}
				}

				// Handle seriesTitle localization if it is an object
				// The sync script might have synced it as-is (object) or string. 
				// We resolve it here to a string.
				let seriesTitleString = undefined
				if (post.data.seriesTitle) {
					if (typeof post.data.seriesTitle === 'object') {
						const obj = post.data.seriesTitle as any
						seriesTitleString = obj[post.data.lang] || obj['es']
					} else {
						seriesTitleString = post.data.seriesTitle
					}
				}

				// Handle seriesDescription localization if it is an object
				let seriesDescriptionString = undefined
				if (post.data.seriesDescription) {
					if (typeof post.data.seriesDescription === 'object') {
						const obj = post.data.seriesDescription as any
						seriesDescriptionString = obj[post.data.lang] || obj['es']
					} else {
						seriesDescriptionString = post.data.seriesDescription
					}
				}

				return {
					...post,
					data: {
						...post.data,
						pubDate: post.data.pubDate!, // ensured by filter
						series,
						seriesTitle: seriesTitleString,
						seriesDescription: seriesDescriptionString
					},
				} as unknown as DevlogPost
			})
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

		// Resolve title/description (might be object in part1.data from Zod schema)
		let resolvedSeriesTitle = part1.data.title
		if (part1.data.seriesTitle) {
			if (typeof part1.data.seriesTitle === 'object') {
				const t = part1.data.seriesTitle as any
				resolvedSeriesTitle = t[part1.data.lang] || t['es']
			} else {
				resolvedSeriesTitle = part1.data.seriesTitle
			}
		}

		let resolvedSeriesDescription = part1.data.description
		if (part1.data.seriesDescription) {
			if (typeof part1.data.seriesDescription === 'object') {
				const d = part1.data.seriesDescription as any
				resolvedSeriesDescription = d[part1.data.lang] || d['es']
			} else {
				resolvedSeriesDescription = part1.data.seriesDescription
			}
		}

		const entry: DevlogPost = {
			...part1,
			data: {
				...part1.data,
				title: resolvedSeriesTitle,
				description: resolvedSeriesDescription,
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
