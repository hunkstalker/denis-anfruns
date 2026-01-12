import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TagFilter from './TagFilter'
import type { Tag } from '@data/tags'

interface Props {
	// TagFilter Props
	tags: Tag[]
	filter: Tag | 'all'
	setFilter: (tag: Tag | 'all') => void
	tagLabelAll: string

	// Shared
	mounted: boolean
	labelFilters: string // "Filtros"
}

export default function MobileFilters({
	tags,
	filter,
	setFilter,
	tagLabelAll,
	mounted,
	labelFilters,
}: Props) {
	const [isOpen, setIsOpen] = useState(false)

	// Calculate active filters count for badge
	const activeCount = filter !== 'all' ? 1 : 0

	return (
		<div className="mb-8 w-full md:hidden">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
			>
				<div className="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="4" x2="4" y1="21" y2="14" />
						<line x1="4" x2="4" y1="10" y2="3" />
						<line x1="12" x2="12" y1="21" y2="12" />
						<line x1="12" x2="12" y1="8" y2="3" />
						<line x1="20" x2="20" y1="21" y2="16" />
						<line x1="20" x2="20" y1="12" y2="3" />
						<line x1="1" x2="7" y1="14" y2="14" />
						<line x1="9" x2="15" y1="8" y2="8" />
						<line x1="17" x2="23" y1="16" y2="16" />
					</svg>
					<span>{labelFilters}</span>
					{activeCount > 0 && (
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white dark:bg-white dark:text-zinc-900">
							{activeCount}
						</span>
					)}
				</div>
				<motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</motion.div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="overflow-hidden"
					>
						<div className="flex flex-col gap-6 rounded-b-xl border-x border-b border-zinc-200 bg-white/50 p-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
							<TagFilter
								tags={tags}
								filter={filter}
								setFilter={setFilter}
								mounted={mounted}
								labelAll={tagLabelAll}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
