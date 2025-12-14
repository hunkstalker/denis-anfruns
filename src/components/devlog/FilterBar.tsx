interface Props {
	allTags: string[]
	selectedTag: string | null
	onSelectTag: (tag: string | null) => void
	lang: 'es' | 'en' | 'ca'
	mounted: boolean
}

export default function DevLogFilterBar({
	allTags,
	selectedTag,
	onSelectTag,
	lang,
	mounted,
}: Props) {
	return (
		<div className="no-scrollbar mb-10 flex w-full items-center gap-2 overflow-x-auto pb-4 md:flex-wrap md:pb-0">
			<button
				onClick={() => onSelectTag(null)}
				className={`w-24 shrink-0 rounded-full border py-1.5 text-center text-sm font-medium transition-colors ${
					mounted && selectedTag === null
						? 'border-[--tangerine-hover] bg-[--tangerine-hover] text-zinc-900 dark:border-[--tangerine] dark:bg-[--tangerine] dark:text-zinc-900'
						: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
				}`}
			>
				{lang === 'es' ? 'Todo' : lang === 'ca' ? 'Tot' : 'All'}
			</button>
			{allTags.map((tag) => (
				<button
					key={tag}
					onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
					className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
						mounted && selectedTag === tag
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
