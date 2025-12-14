import { motion, AnimatePresence } from 'framer-motion'
import DevLogCard from './Card'
import type { DevlogPost } from '../../utils/devlog-content'
import { useDevLogFilter } from '../../hooks/useDevLogFilter'
import DevLogFilterBar from './FilterBar'

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

	if (layout === 'blogList') {
		// Simple list view for main blog page
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
					{filteredPosts.map((post, _index) => (
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
