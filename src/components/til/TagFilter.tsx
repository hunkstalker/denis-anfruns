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
				title={labelAll}
				disabled={filter === 'all'}
				className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
					mounted && filter === 'all'
						? 'cursor-default border-zinc-200 bg-zinc-50 text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-700'
						: 'border-zinc-200 bg-white text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-900/30 dark:hover:bg-red-900/20 dark:hover:text-red-400'
				}`}
			>
				<span className="sr-only">{labelAll}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
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
