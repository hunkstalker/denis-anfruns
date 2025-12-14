import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TilCard from './Card'
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
			<div className="no-scrollbar mb-10 flex w-full items-center gap-2 overflow-x-auto pb-4 md:flex-wrap md:pb-0">
				<button
					onClick={() => setFilter('all')}
					className={`w-24 shrink-0 rounded-full border py-1.5 text-center text-sm font-medium transition-colors ${
						mounted && filter === 'all'
							? 'border-[--tangerine-hover] bg-[--tangerine-hover] text-zinc-900 dark:border-[--tangerine] dark:bg-[--tangerine] dark:text-zinc-900'
							: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
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
								? 'border-[--tangerine-hover] bg-[--tangerine-hover] text-zinc-900 dark:border-[--tangerine] dark:bg-[--tangerine] dark:text-zinc-900'
								: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
						}`}
					>
						#{tag}
					</button>
				))}
			</div>

			{/* Grid */}
			<motion.div layout className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="popLayout">
					{filteredPosts.length === 0 && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="col-span-full italic text-zinc-500"
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
							<TilCard
								post={post}
								lang={lang}
								index={index}
								labels={{ readNote: labels.readNote }}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</div>
	)
}
