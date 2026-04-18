import React from 'react'
import type { Tag } from '@data/tags'

interface Props {
	tags: Tag[]
	filter: Tag | 'all'
	setFilter: (tag: Tag | 'all') => void
	mounted: boolean
	labelAll: string
}

export default function TagFilter({ tags, filter, setFilter, mounted, labelAll }: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			<button
				onClick={() => setFilter('all')}
				className={`w-24 shrink-0 rounded-full border py-1.5 text-center text-sm font-medium transition-colors ${
					mounted && filter === 'all'
						? 'border-[--tangerine-hover] bg-[--tangerine-hover] text-zinc-900 dark:border-[--tangerine] dark:bg-[--tangerine] dark:text-zinc-900'
						: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
				}`}
			>
				{labelAll}
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
	)
}
