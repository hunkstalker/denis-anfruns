import React from 'react'
import { motion } from 'framer-motion'

type ViewMode = 'all' | 'singles' | 'series'

interface Props {
	viewMode: ViewMode
	setViewMode: (mode: ViewMode) => void
	mounted: boolean
	label: string // "Vista" or "View"
	labels: {
		all: string
		singles: string
		series: string
	}
}

export default function ViewModeFilter({ viewMode, setViewMode, mounted, label, labels }: Props) {
	const modes: { id: ViewMode; label: string }[] = [
		{ id: 'all', label: labels.all },
		{ id: 'singles', label: labels.singles },
		{ id: 'series', label: labels.series },
	]

	return (
		<motion.div layout className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
			{modes.map((mode) => {
				const isActive = mounted && viewMode === mode.id
				return (
					<motion.button
						layout
						key={mode.id}
						onClick={() => setViewMode(mode.id)}
						className={`text-xs relative rounded-lg px-3 py-1 font-medium transition-colors ${
							isActive
								? 'bg-white text-zinc-900 shadow-sm ring-1 ring-black/5 dark:bg-zinc-700 dark:text-white dark:ring-white/10'
								: 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
						}`}
						transition={{ layout: { duration: 0.3, type: 'spring', bounce: 0 } }}
					>
						{mode.label}
					</motion.button>
				)
			})}
		</motion.div>
	)
}
