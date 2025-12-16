import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DevLogCard from './Card'
import type { DevlogPost } from '@utils/devlog-content'
import { useDevLogFilter } from '@hooks/useDevLogFilter'
import DevLogFilterBar from './FilterBar'
import { useIntersectionObserver } from '@hooks/useIntersectionObserver'

interface Props {
	posts: DevlogPost[]
	lang: 'es' | 'en' | 'ca'
	labels: {
		readArticle: string
	}
	layout?: 'grid' | 'blogList'
}

export default function DevLogGrid({ posts, lang, labels, layout = 'grid' }: Props) {
	// 1. Logic extracted to custom hook
	const { selectedTag, setSelectedTag, allTags, filteredPosts, mounted } = useDevLogFilter(posts)

	// Infinite Scroll state
	const INITIAL_COUNT = 24
	const LOAD_MORE_COUNT = 12
	const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
	const loadMoreRef = useRef<HTMLDivElement>(null)

	// Reset visible count when filter changes
	useEffect(() => {
		setVisibleCount(INITIAL_COUNT)
	}, [selectedTag])

	const visiblePosts = filteredPosts.slice(0, visibleCount)
	const hasMore = visibleCount < filteredPosts.length

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
	}

	useIntersectionObserver({
		target: loadMoreRef,
		onIntersect: handleLoadMore,
		enabled: hasMore,
		rootMargin: '200px',
	})

	if (layout === 'blogList') {
		// Simple list view for main blog page - SHOW ALL (or apply pagination if needed later)
		// For now, blogList is usually distinct, but if it needs scroll we can add it.
		// Assuming blogList is small enough or handled by parent otherwise.
		return (
			<div className="grid gap-4 sm:gap-6 lg:gap-8">
				{posts.map((post, index) => (
					<motion.div
						key={post.slug}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<DevLogCard post={post} lang={lang} labels={labels} layout="blogList" />
					</motion.div>
				))}
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* 2. UI extracted to component */}
			<DevLogFilterBar
				allTags={allTags}
				selectedTag={selectedTag}
				onSelectTag={setSelectedTag}
				lang={lang}
				mounted={mounted}
			/>

			{/* Grid Layout */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				<AnimatePresence mode="popLayout">
					{visiblePosts.map((post, _index) => (
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

			{visiblePosts.length === 0 && (
				<div className="py-12 text-center text-zinc-500">
					<p>No matches found for this filter.</p>
				</div>
			)}

			{/* Infinite Scroll Trigger */}
			{hasMore && (
				<div
					ref={loadMoreRef}
					className="flex justify-center py-8 opacity-0"
					aria-hidden="true"
				>
					<span className="sr-only">Loading more...</span>
				</div>
			)}
		</div>
	)
}
