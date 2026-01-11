import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import type { ContentItem } from './AdminTypes';

interface AdminHiddenSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	hiddenIds: Set<string>;
	items: ContentItem[];
	onToggleHide: (id: string, e?: React.MouseEvent) => void;
	onUnhideAll: () => void;
}

export default function AdminHiddenSidebar({
	isOpen,
	onClose,
	hiddenIds,
	items,
	onToggleHide,
	onUnhideAll
}: AdminHiddenSidebarProps) {
	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ x: '-100%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: '-100%', opacity: 0 }}
			transition={{ type: 'spring', damping: 25, stiffness: 200 }}
			className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col"
		>
			<div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-black/20">
				<div>
					<h3 className="font-bold text-zinc-900 dark:text-white">Hidden Items</h3>
					<p className="text-xs text-zinc-500">{hiddenIds.size} items archived</p>
				</div>
				<button onClick={onClose} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md text-zinc-500">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-2 space-y-2">
				{hiddenIds.size === 0 ? (
					<div className="text-center py-10 text-zinc-400 text-sm">
						No hidden items.
					</div>
				) : (
					items.filter(i => hiddenIds.has(i.id)).map(item => (
						<motion.div
							key={item.id}
							layout
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm group flex justify-between items-center gap-2"
						>
							<div className="flex-1 min-w-0">
								<h4 className="font-medium text-xs text-zinc-700 dark:text-zinc-200 truncate">{item.title || item.id}</h4>
								<div className="flex items-center gap-2 mt-0.5">
									<Badge size="xs" variant="subtle" intent={item.collection === 'notes' ? 'emerald' : 'blue'}>{item.collection}</Badge>
									<span className="text-[10px] text-zinc-400 font-mono truncate">{item.series || 'No Series'}</span>
								</div>
							</div>
							<button
								onClick={(e) => onToggleHide(item.id, e)}
								className="p-1.5 text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
								title="Unhide"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
							</button>
						</motion.div>
					))
				)}
			</div>

			{hiddenIds.size > 0 && (
				<div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20">
					<button
						onClick={onUnhideAll}
						className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
						Unhide All
					</button>
				</div>
			)}
		</motion.div>
	);
}
