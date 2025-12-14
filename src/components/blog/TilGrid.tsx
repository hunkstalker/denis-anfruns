import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TilCard from './TilCard'
import type { TilPost } from '../../utils/til-content'

interface Props {
	posts: TilPost[]
	lang: 'es' | 'en' | 'ca'
	labels: {
		all: string
		noResults: string
		readNote: string
	}
}

export default function TilGrid({ posts, lang, labels }: Props) {
	const [filter, setFilter] = useState(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			return params.get('tag') || 'all'
		}
		return 'all'
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
			if (filter === 'all') {
				url.searchParams.delete('tag')
			} else {
				url.searchParams.set('tag', filter)
			}
			window.history.replaceState(null, '', url.toString())
		}
	}, [filter, mounted])

	// Extract unique tags
	const tags = useMemo(() => {
		const allTags = posts.flatMap((post) => post.data.tags || [])
		return [...new Set(allTags)].sort()
	}, [posts])

	// Filter posts
	const filteredPosts = useMemo(() => {
		if (filter === 'all') return posts
		return posts.filter((post) => post.data.tags?.includes(filter))
	}, [posts, filter])

	return (
		<div className="w-full">
			{/* Filters */}
			{/* Filters */}
			<div className="mb-10 flex w-full gap-2 overflow-x-auto pb-4 md:flex-wrap md:pb-0 no-scrollbar items-center">
				<button
					onClick={() => setFilter('all')}
					className={`w-24 shrink-0 rounded-full border py-1.5 text-center text-sm font-medium transition-colors ${
						mounted && filter === 'all'
							? 'bg-[--tangerine-hover] text-zinc-900 border-[--tangerine-hover] dark:bg-[--tangerine] dark:text-zinc-900 dark:border-[--tangerine]'
							: 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:border-zinc-600'
					}`}
				>
					{labels.all}
				</button>
				{tags.map((tag) => (
					<button
						key={tag}
						onClick={() => setFilter(tag)}
						className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
							mounted && filter === tag
								? 'bg-[--tangerine-hover] text-zinc-900 border-[--tangerine-hover] dark:bg-[--tangerine] dark:text-zinc-900 dark:border-[--tangerine]'
								: 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:border-zinc-600'
						}`}
					>
						#{tag}
					</button>
				))}
			</div>

			{/* Grid */}
			<motion.div 
				layout
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
			>
				<AnimatePresence mode='popLayout'>
					{filteredPosts.length === 0 && (
						<motion.p 
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="italic text-zinc-500 col-span-full"
						>
							{labels.noResults}
						</motion.p>
					)}
					{filteredPosts.map((post, index) => (
						<motion.div
							key={post.slug}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.2 }}
							className="h-full"
						>
							<TilCard post={post} lang={lang} index={index} labels={{ readNote: labels.readNote }} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</div>
	)
}
