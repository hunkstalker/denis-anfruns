import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DevLogCard from './DevLogCard'
import type { DevlogPost } from '../../utils/devlog-content'

interface Props {
	posts: DevlogPost[]
	lang: 'es' | 'en' | 'ca'
	labels: {
		readArticle: string
	}
    layout?: 'grid' | 'list'
}

export default function BlogDevLogList({ posts, lang, labels, layout = 'grid' }: Props) {
    const [selectedTag, setSelectedTag] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            return params.get('tag') || null
        }
        return null
    })

    // Handle hydration mismatch for active state
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Update URL when filter changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            if (!selectedTag) {
                url.searchParams.delete('tag')
            } else {
                url.searchParams.set('tag', selectedTag)
            }
            window.history.replaceState(null, '', url.toString())
        }
    }, [selectedTag, mounted])

    if (layout === 'list') {
        // Simple list view for main blog page (no filters, no grid)
        return (
            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <DevLogCard post={post} lang={lang} labels={labels} layout="list" />
                    </motion.div>
                ))}
            </div>
        )
    }

    // Grid Layout Logic (Filters + Big Cards)
    const allTags = useMemo(() => {
        const tags = new Set<string>()
        posts.forEach(post => {
            post.data.tags?.forEach(tag => tags.add(tag))
        })
        return Array.from(tags).sort()
    }, [posts])

    const filteredPosts = useMemo(() => {
        if (!selectedTag) return posts
        return posts.filter(post => post.data.tags?.includes(selectedTag))
    }, [posts, selectedTag])

	return (
		<div className="space-y-8">
            {/* Filter Pills - Matching TilGrid style */}
            <div className="mb-10 flex w-full gap-2 overflow-x-auto pb-4 md:flex-wrap md:pb-0 no-scrollbar items-center">
                <button
                    onClick={() => setSelectedTag(null)}
                    className={`w-24 shrink-0 rounded-full border py-1.5 text-center text-sm font-medium transition-colors ${
                        mounted && selectedTag === null
                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:border-zinc-600'
                    }`}
                >
                    {lang === 'es' ? 'Todo' : lang === 'ca' ? 'Tot' : 'All'}
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                            mounted && selectedTag === tag
                                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:border-zinc-600'
                        }`}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {/* Grid Layout */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            layout
                            layoutId={post.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DevLogCard post={post} lang={lang} labels={labels} layout="grid" />
                        </motion.div>
                    ))}
                </AnimatePresence>
			</div>

            {filteredPosts.length === 0 && (
                <div className="py-12 text-center text-zinc-500">
                    <p>No matches found for this filter.</p>
                </div>
            )}
		</div>
	)
}
