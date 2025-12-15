import { getCollection, type CollectionEntry } from 'astro:content'
import type { Tag } from '../data/tags'

export type TilPost = Omit<CollectionEntry<'til'>, 'data'> & {
    data: Omit<CollectionEntry<'til'>['data'], 'pubDate' | 'tags'> & {
        pubDate: Date
        tags: Tag[]
        series?: string
        new?: boolean
        icon?: string
        end?: boolean
    }
}

// Load all meta.json files at build time
const metaFiles = import.meta.glob('../content/til/**/meta.json', {
    eager: true,
    import: 'default',
})

export async function getTils(): Promise<TilPost[]> {
    const posts = await getCollection('til')

    const mapped = posts.map((post) => {
        // Use post.id to get the real directory structure
        // post.id is like "series/part-1/es.mdx" or "simple-til/es.mdx"
        // Ensure forward slashes for cross-platform consistency
        const normalizedId = post.id.replaceAll('\\', '/')

        const lastSlashIndex = normalizedId.lastIndexOf('/')
        const folder = lastSlashIndex !== -1 ? normalizedId.substring(0, lastSlashIndex) : ''

        const metaKey = `../content/til/${folder}/meta.json`
        const meta = metaFiles[metaKey] as
            | {
                  pubDate?: string
                  tags?: string[]
                  draft?: boolean
                  new?: boolean
                  icon?: string
                  end?: boolean
                  seriesTitle?: string | Record<string, string>
                  seriesDescription?: string | Record<string, string>
                  series?: string
              }
            | undefined

        // Validar y parsear fecha
        let pubDate: Date | undefined = post.data.pubDate
        if (meta?.pubDate) {
            pubDate = new Date(meta.pubDate)
        }

        // Safety net: ensure pubDate is never undefined for the type contract
        if (!pubDate) {
            pubDate = new Date(0)
        }

        // Validar y combinar tags
        const frontmatterTags = post.data.tags || []
        const metaTags = meta?.tags || []
        // Merge uniquing tags
        let tags: Tag[] = Array.from(new Set([...metaTags, ...frontmatterTags])) as Tag[]

        // Merge draft
        const draft = meta?.draft !== undefined ? meta.draft : post.data.draft

        // Merge new
        const isNew = meta?.new !== undefined ? meta.new : false

        // Merge icon (meta.json takes priority, then frontmatter)
        const icon = meta?.icon || post.data.icon

        // Merge end
        const end = meta?.end !== undefined ? meta.end : post.data.end

        // Infer series from folder structure if not present in frontmatter
        let series = meta?.series || post.data.series
        if (!series) {
            const parts = folder.split('/')
            if (parts.length > 0 && parts[0] !== folder) {
                series = parts[0]
            }
        }

        // Helper for localized meta strings
        const getLocalizedMeta = (
            val: string | Record<string, string> | undefined, 
            fallback: string | undefined
        ): string | undefined => {
            if (!val) return fallback
            if (typeof val === 'string') return val
            // It's an object, try to find for current lang
            const lang = post.data.lang || 'es'
            return val[lang] || val['es'] || val['en'] || Object.values(val)[0]
        }

        return {
            ...post,
            data: {
                ...post.data,
                pubDate,
                tags,
                draft,
                series,
                new: isNew,
                icon,
                end,
                seriesTitle: getLocalizedMeta(meta?.seriesTitle, post.data.seriesTitle),
                seriesDescription: getLocalizedMeta(meta?.seriesDescription, post.data.seriesDescription),
            },
        }
    })

    // Filter out posts that still don't have a date (legacy or missing meta)
    // Then filter out drafts in production
    return mapped
        .filter((post) => !post.id.endsWith('.json'))
        .filter(
            (post) => post.data.pubDate !== undefined && Array.isArray(post.data.tags),
        )
        .filter((post) => (import.meta.env.PROD ? post.data.draft !== true : true)) as TilPost[]
}

export function groupTilsBySeries(posts: TilPost[]): TilPost[] {
    const seriesMap = new Map<string, TilPost[]>()
    const soloPosts: TilPost[] = []

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

        const part1 = list[0]
        const latestPart = list[list.length - 1]

        // Check if ANY part in the series is marked as new
        const hasNewContent = list.some(p => p.data.new)

        // Use seriesTitle is available, otherwise falling back to Part 1 title
        const title = part1.data.seriesTitle || part1.data.title
        // Use seriesDescription if available, otherwise falling back to Part 1 description
        const description = part1.data.seriesDescription || part1.data.description

        const entry: TilPost = {
            ...part1,
            data: {
                ...part1.data,
                title,
                description,
                pubDate: latestPart.data.pubDate,
                new: hasNewContent
            },
        }
        return entry
    })

    return [...soloPosts, ...finalSeriesPosts].sort((a, b) => {
        return b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    })
}
