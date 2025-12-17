import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ContentItem } from './AdminTypes';
import { TechIcon, UNIQUE_ICONS } from './AdminIcons';

interface AdminEditSidebarProps {
	editingItem: ContentItem | null;
	setEditingItem: (item: ContentItem | null) => void;
	selectedIds: Set<string>;
	setSelectedIds: (ids: Set<string>) => void;
	items: ContentItem[];
	setItems: (items: ContentItem[]) => void;
	handleSaveEdit: () => void;
	displayedItems: any[]; // For visual traverse in bulk logic
}

export default function AdminEditSidebar({
	editingItem,
	setEditingItem,
	selectedIds,
	setSelectedIds,
	items,
	setItems,
	handleSaveEdit,
	displayedItems
}: AdminEditSidebarProps) {

	if (!editingItem) return null;

	const isBulk = editingItem.id === 'BULK_EDIT';
	const headerTitle = isBulk ? `Editing ${selectedIds.size} Items` : 'Edit Content';

	// Bulk Tag Logic
	let divergentTags = false;
	if (isBulk) {
		const flatItems: ContentItem[] = [];
		const traverse = (list: any[]) => {
			list.forEach(i => {
				if (i.type === 'folder') traverse(i.children);
				else flatItems.push(i);
			});
		};
		traverse(displayedItems); // Use displayedItems to check visual selection
		const selectedItemsList = flatItems.filter(i => selectedIds.has(i.id));

		if (selectedItemsList.length > 0) {
			const firstTags = new Set(selectedItemsList[0].tags || []);
			divergentTags = !selectedItemsList.every(item => {
				const t = new Set(item.tags || []);
				if (t.size !== firstTags.size) return false;
				for (let x of t) if (!firstTags.has(x)) return false;
				return true;
			});
		}
	}

	return (
		<motion.div
			initial={{ x: '100%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: '100%', opacity: 0 }}
			transition={{ type: 'spring', damping: 25, stiffness: 200 }}
			className={`fixed top-0 right-0 bottom-0 ${'w-[600px]'} bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 p-6 flex flex-col transition-[width] duration-300`}
		>
			<div className="flex items-center justify-between mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
				<h3 className="text-xl font-bold text-zinc-900 dark:text-white">{headerTitle}</h3>
				<button onClick={() => { setSelectedIds(new Set()); setEditingItem(null); }} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			{/* --- BULK DATE INTERPOLATION SECTION --- */}
			{isBulk && (
				<div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl space-y-4">
					<div className="flex items-center gap-2 mb-2">
						<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
						<h3 className="font-bold text-sm text-blue-700 dark:text-blue-300">Smart Date Distribution</h3>
					</div>


					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-zinc-500">Start Date</label>
							<input
								type="date"
								className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
								id="bulk-start-date"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-xs font-medium text-zinc-500">End Date</label>
							<input
								type="date"
								className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
								id="bulk-end-date"
							/>
						</div>
					</div>

					<button
						onClick={() => {
							const startEl = document.getElementById('bulk-start-date') as HTMLInputElement;
							const endEl = document.getElementById('bulk-end-date') as HTMLInputElement;
							if (!startEl?.value || !endEl?.value) return;

							const start = new Date(startEl.value).getTime();
							const end = new Date(endEl.value).getTime();
							const count = selectedIds.size;

							if (count < 2) return;

							const step = (end - start) / (count - 1);

							// Need selected items in ORDER (visual)
							const flatItems: ContentItem[] = [];
							const traverse = (list: any[]) => {
								list.forEach(i => {
									if (i.type === 'folder') traverse(i.children);
									else flatItems.push(i);
								});
							};
							traverse(displayedItems);

							const targetItems = flatItems.filter(i => selectedIds.has(i.id));

							// Prepare updates
							const updatesList: any[] = [];
							const newItems = [...items];

							targetItems.forEach((item, idx) => {
								const newTime = start + (step * idx);
								const newDate = new Date(newTime).toISOString();

								updatesList.push({
									filePath: item.filePath,
									pubDate: newDate
								});

								// Optimistic Update
								const existing = newItems.find(i => i.id === item.id);
								if (existing) existing.pubDate = newDate;
							});

							setItems(newItems);

							// API Call
							fetch('/api/admin/update', {
								method: 'POST',
								body: JSON.stringify({ updates: updatesList })
							}).then(res => {
								if (res.ok) alert("Dates distributed successfully!");
								else alert("Failed to save dates");
							}).catch(e => {
								console.error(e);
								alert("Error distributing dates");
							});
						}}
						className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
					>
						Apply Distributed Dates
					</button>
				</div>
			)}

			{/* --- MERGE TAGS SECTION --- */}
			{isBulk && divergentTags && (
				<div className="mb-6 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-between">
					<div className="text-xs text-orange-700 dark:text-orange-300">
						<span className="font-bold block">Tags are inconsistent!</span>
						Some selected items have different tags.
					</div>
					<button
						onClick={() => {
							const flatItems: ContentItem[] = [];
							const traverse = (list: any[]) => {
								list.forEach(i => {
									if (i.type === 'folder') traverse(i.children);
									else flatItems.push(i);
								});
							};
							traverse(items);
							const selectedItemsList = flatItems.filter(i => selectedIds.has(i.id));

							const unionTags = new Set<string>();
							selectedItemsList.forEach(i => i.tags?.forEach(t => unionTags.add(t)));

							const mergedTags = Array.from(unionTags);
							setEditingItem({ ...editingItem!, tags: mergedTags });
							alert("Tags merged in form! Click Save (Cmd+S) or Apply to finish.");
						}}
						className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded shadow-sm transition-colors"
					>
						Merge Tags
					</button>
				</div>
			)}

			<div className="space-y-6 flex-1 overflow-y-auto pr-2 -mr-2">
				{/* 1. Identity */}
				<div className={`space-y-6 ${isBulk ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
					<h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-4">
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
						Identity details
					</h4>
					<div className="space-y-2">
						<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Title (MDX)</label>
						<input
							type="text"
							value={editingItem.title}
							onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
							className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-3 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
						/>
					</div>

				</div>

				{/* 2. Classification */}
				<div className={`space-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800`}>
					<h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-4">
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
						Classification
					</h4>

					<div className="space-y-2">
						<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Tags (comma separated)</label>
						<textarea
							value={editingItem.tags?.join(', ') || ''}
							onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(t => t.trim()) })}
							className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors h-24 resize-none font-mono"
						/>
					</div>
				</div>

				{/* 3. Settings & Visuals */}
				<div className="space-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
					<h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-4">
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
						Configuration
					</h4>
					<div className="grid grid-cols-2 gap-6">
						<div className={`space-y-2 ${isBulk ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
							<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Date</label>
							<input
								type="datetime-local"
								value={editingItem.pubDate ? new Date(editingItem.pubDate).toISOString().slice(0, 16) : ''}
								onChange={(e) => {
									const val = e.target.value;
									setEditingItem({ ...editingItem, pubDate: val ? new Date(val).toISOString() : '' });
								}}
								className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-3 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
							/>
						</div>
						<div className={`space-y-2 col-span-2 ${isBulk ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
							<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Select Icon</label>
							<div className="grid grid-cols-8 gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/50 max-h-40 overflow-y-auto custom-scrollbar">
								{UNIQUE_ICONS.map(iconKey => (
									<button
										key={iconKey}
										onClick={() => {
											const currentTags = editingItem.tags ? [...editingItem.tags] : [];
											if (!currentTags.includes(iconKey)) {
												currentTags.push(iconKey);
											}
											setEditingItem({
												...editingItem,
												icon: iconKey,
												tags: currentTags
											});
										}}
										className={`
                                            p-2 rounded-md flex items-center justify-center transition-all group relative
                                            ${editingItem.icon === iconKey
												? 'bg-orange-100 dark:bg-orange-500/20 ring-2 ring-orange-500'
												: 'hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm'
											}
                                        `}
										title={iconKey}
									>
										<div className="w-5 h-5">
											<TechIcon name={iconKey} className="w-full h-full" />
										</div>
									</button>
								))}
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 pt-4">
						<div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors" onClick={() => setEditingItem({ ...editingItem, new: !editingItem.new })}>
							<span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">New Status</span>
							<div className={`w-10 h-5 rounded-full relative transition-colors ${editingItem.new ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
								<div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${editingItem.new ? 'left-6' : 'left-1'}`}></div>
							</div>
						</div>
						<div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors" onClick={() => setEditingItem({ ...editingItem, draft: !editingItem.draft })}>
							<span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Draft Mode</span>
							<div className={`w-10 h-5 rounded-full relative transition-colors ${editingItem.draft ? 'bg-zinc-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
								<div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${editingItem.draft ? 'left-6' : 'left-1'}`}></div>
							</div>
						</div>

					</div>
				</div>
			</div>

			<div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
				<button
					onClick={() => { setEditingItem(null); setSelectedIds(new Set()); }}
					className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold hover:bg-zinc-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors"
				>
					Cancel
				</button>
				<button
					onClick={handleSaveEdit}
					className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity shadow-lg"
				>
					{isBulk ? 'Apply to Selected' : 'Save Changes'}
				</button>
			</div>
		</motion.div>
	);
}
