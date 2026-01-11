import { getCollection, type CollectionEntry } from 'astro:content'
import type { Tag } from '../data/tags'

export type NotePost = Omit<CollectionEntry<'notes'>, 'data'> & {
    data: Omit<CollectionEntry<'notes'>['data'], 'pubDate' | 'tags'> & {
        pubDate: Date
        tags: Tag[]
        series?: string
        new?: boolean
        icon?: string
        end?: boolean
        seriesCount?: number
        newSlugs?: string[]
        allSlugs?: string[]
        seriesTitle?: string // Now just string in frontmatter
    }
}

export async function getNotes(): Promise<NotePost[]> {
    const posts = await getCollection('notes')

    // Filter out posts that still don't have a date or are drafts in PROD
    return posts
        .filter((post) => !post.id.endsWith('.json'))
        .filter((post) => post.data.pubDate !== undefined && Array.isArray(post.data.tags))
        .filter((post) => (import.meta.env.PROD ? post.data.draft !== true : true))
        .map((post) => {
            // Data is already correctly populated by the sync script in es.mdx/en.mdx
            // We just need to ensure types match our internal NotePost interface
            
            // Infer series from folder structure if not present in frontmatter
            let series = post.data.series
            if (!series) {
                const parts = post.id.replace(/\\/g, '/').split('/')
                // structure: series-name/part-1/lang.mdx OR simple-slug/lang.mdx
                // If it has folder depth, take the top folder
                 if (parts.length > 2) {
                    series = parts[0]
                }
            }

            return {
                ...post,
                data: {
                    ...post.data,
                    // post.data.pubDate is already Date (coerced by Zod in config.ts)
                    pubDate: post.data.pubDate!, // Filtered above
                    tags: post.data.tags as Tag[],
                    series,
                    // If seriesTitle was an object in schema, we might need to adjust config.ts
                    // But if it's string in frontmatter (which it is now), Zod handles it.
                    // If config.ts still has union, we might need to normalize here just in case.
                    seriesTitle: typeof post.data.seriesTitle === 'object' 
                        ? (post.data.seriesTitle as any)[post.data.lang] || (post.data.seriesTitle as any)['es'] 
                        : post.data.seriesTitle
                },
            }
        })
}

export function groupNotesBySeries(posts: NotePost[]): NotePost[] {
    const seriesMap = new Map<string, NotePost[]>()
    const soloPosts: NotePost[] = []

    for (const post of posts) {
        if (post.data.series) {
            const list = seriesMap.get(post.data.series) || []
            list.push(post)
            seriesMap.set(post.data.series, list)
        } else {
            soloPosts.push(post)
        }
    }

    const finalSeriesPosts = Array.from(seriesMap.values()).map((list) => {
        list.sort((a, b) => {
            return a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
        })

        if (list.length === 0) return null

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

        const entry: NotePost = {
            ...part1,
            data: {
                ...part1.data,
                title: resolvedSeriesTitle,
                description: resolvedSeriesDescription,
                pubDate: latestPart.data.pubDate,
                new: hasNewContent,
                seriesCount: list.length,
                newSlugs: list.filter(p => p.data.new).map(p => p.slug),
                allSlugs: list.map(p => p.slug)
            },
        }
        return entry
    }).filter(Boolean) as NotePost[]

    return [...soloPosts, ...finalSeriesPosts].sort((a, b) => {
        return b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    })
}
