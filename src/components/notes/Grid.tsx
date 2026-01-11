import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TilCard from './Card'
import type { NotePost } from '@utils/notes-content'
import type { Tag } from '@data/tags'
import { useIntersectionObserver } from '@hooks/useIntersectionObserver'

// Props interface update
interface Props {
	posts: NotePost[]
	lang: 'es' | 'en' | 'ca'
	labels: {
		all: string
		noResults: string
		readNote: string
		view: string
		viewAll: string
		viewSingles: string
		viewSeries: string
		filters: string
	}
}

import ViewModeFilter from './ViewModeFilter'
import TagFilter from './TagFilter'
import MobileFilters from './MobileFilters'

export default function TilGrid({ posts, lang, labels }: Props) {
	const [filter, setFilter] = useState<Tag | 'all'>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			return (params.get('tag') as Tag) || 'all'
		}
		return 'all'
	})

	const [viewMode, setViewMode] = useState<'all' | 'singles' | 'series'>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			const mode = params.get('view')
			if (mode === 'singles' || mode === 'series') return mode
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
			if (filter === 'all') url.searchParams.delete('tag')
			else url.searchParams.set('tag', filter)

			if (viewMode === 'all') url.searchParams.delete('view')
			else url.searchParams.set('view', viewMode)

			window.history.replaceState(null, '', url.toString())
		}
	}, [filter, viewMode, mounted])

	// Extract unique tags (Only first 2 tags per post are used for filtering)
	const tags = useMemo(() => {
		const allTags = posts.flatMap((post) => (post.data.tags || []).slice(0, 2))
		return [...new Set(allTags)].sort()
	}, [posts])

	// Filter posts
	const filteredPosts = useMemo(() => {
		let result = posts

		// 1. Filter by View Mode
		if (viewMode === 'singles') {
			result = result.filter((post) => !post.data.seriesCount)
		} else if (viewMode === 'series') {
			result = result.filter((post) => !!post.data.seriesCount)
		}

		// 2. Filter by Tag
		if (filter !== 'all') {
			result = result.filter((post) => post.data.tags?.includes(filter))
		}
		return result
	}, [posts, filter, viewMode])

	// Infinite Scroll state
	const INITIAL_COUNT = 24
	const LOAD_MORE_COUNT = 12
	const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
	const loadMoreRef = useRef<HTMLDivElement>(null)

	// Reset visible count when filter changes
	useEffect(() => {
		setVisibleCount(INITIAL_COUNT)
	}, [filter])

	const visiblePosts = filteredPosts.slice(0, visibleCount)
	const hasMore = visibleCount < filteredPosts.length

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
	}

	useIntersectionObserver({
		target: loadMoreRef,
		onIntersect: handleLoadMore,
		enabled: hasMore,
		rootMargin: '200px', // Load before reaching the very bottom
	})

	return (
		<div className="w-full">
			{/* Mobile Filters (Dropdown) */}
			<MobileFilters
				viewMode={viewMode}
				setViewMode={setViewMode}
				viewLabels={{
					all: labels.viewAll,
					singles: labels.viewSingles,
					series: labels.viewSeries,
				}}
				viewLabel={labels.view}
				tags={tags}
				filter={filter}
				setFilter={setFilter}
				tagLabelAll={labels.all}
				mounted={mounted}
				labelFilters={labels.filters}
			/>

			{/* Desktop Filters (Sidebar-like / Top Stack) */}
			<div className="mb-10 hidden flex-col items-start gap-6 md:flex">
				<ViewModeFilter
					viewMode={viewMode}
					setViewMode={setViewMode}
					mounted={mounted}
					label={labels.view}
					labels={{
						all: labels.viewAll,
						singles: labels.viewSingles,
						series: labels.viewSeries,
					}}
				/>

				<TagFilter
					tags={tags}
					filter={filter}
					setFilter={setFilter}
					mounted={mounted}
					labelAll={labels.all}
				/>
			</div>

			{/* Grid */}
			<motion.div layout className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="popLayout">
					{visiblePosts.length === 0 && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="col-span-full italic text-zinc-500"
						>
							{labels.noResults}
						</motion.p>
					)}
					{visiblePosts.map((post, index) => (
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

			{/* Infinite Scroll Trigger */}
			{hasMore && (
				<div
					ref={loadMoreRef}
					className="mt-8 flex justify-center py-8 opacity-0"
					aria-hidden="true"
				>
					{/* Optional: Add a loading spinner here if desired */}
					<span className="sr-only">Loading more...</span>
				</div>
			)}
		</div>
	)
}
