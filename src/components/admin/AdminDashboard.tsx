import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';

// --- Local Imports ---
import type { ContentItem, SeriesFolder } from './AdminTypes';
import { TechIcon } from './AdminIcons';
import AdminHiddenSidebar from './AdminHiddenSidebar';
import AdminEditSidebar from './AdminEditSidebar';

export default function AdminDashboard() {
	const [items, setItems] = useState<ContentItem[]>([]);
	const [loading, setLoading] = useState(true);
	// Active Series State (synced with URL)
	const [activeSeries, setActiveSeries] = useState<string | null>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			return params.get('series');
		}
		return null;
	});

	// Sync Active Series to URL
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			if (activeSeries) {
				url.searchParams.set('series', activeSeries);
			} else {
				url.searchParams.delete('series');
			}
			window.history.replaceState({}, '', url.toString());
		}
	}, [activeSeries]);
	const [filter, setFilter] = useState<'all' | 'notes' | 'devlogs' | 'hidden'>('all');
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

	// Edit State
	const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

	// --- Hidden Logic ---
	const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('admin_hidden_ids');
			return saved ? new Set(JSON.parse(saved)) : new Set();
		}
		return new Set();
	});

	useEffect(() => {
		localStorage.setItem('admin_hidden_ids', JSON.stringify(Array.from(hiddenIds)));
	}, [hiddenIds]);

	const toggleHide = (id: string, e?: React.MouseEvent) => {
		e?.stopPropagation();
		const newSet = new Set(hiddenIds);
		if (newSet.has(id)) newSet.delete(id);
		else newSet.add(id);
		setHiddenIds(newSet);
	};

	// Load Data
	const loadContent = () => {
		setLoading(true);
		fetch('/api/admin/content')
			.then(res => res.json())
			.then(data => {
				setItems(data);
				setLoading(false);
			});
	};

	useEffect(() => {
		loadContent();
	}, []);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [showHiddenSidebar, setShowHiddenSidebar] = useState(false);

	// --- Selection Box State ---
	const [isSelecting, setIsSelecting] = useState(false);
	const [selectionBox, setSelectionBox] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Mouse handlers for selection
	const handleMouseDown = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest('button, input, .card-interactive')) return;

		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;

		const x = e.clientX - rect.left + containerRef.current!.scrollLeft;
		const y = e.clientY - rect.top + containerRef.current!.scrollTop;

		setIsSelecting(true);
		setSelectionBox({ start: { x, y }, end: { x, y } });

		if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
			setSelectedIds(new Set());
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isSelecting || !selectionBox || !containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left + containerRef.current.scrollLeft;
		const y = e.clientY - rect.top + containerRef.current.scrollTop;

		setSelectionBox({ ...selectionBox, end: { x, y } });
	};

	const handleMouseUp = () => {
		if (!isSelecting || !selectionBox || !containerRef.current) {
			setIsSelecting(false);
			setSelectionBox(null);
			return;
		}

		// Calculate intersection
		const left = Math.min(selectionBox.start.x, selectionBox.end.x);
		const top = Math.min(selectionBox.start.y, selectionBox.end.y);
		const width = Math.abs(selectionBox.end.x - selectionBox.start.x);
		const height = Math.abs(selectionBox.end.y - selectionBox.start.y);

		if (width < 5 && height < 5) {
			setIsSelecting(false);
			setSelectionBox(null);
			return;
		}

		const newSet = new Set(selectedIds);
		const cardElements = containerRef.current.querySelectorAll('[data-item-id]');
		const containerRect = containerRef.current.getBoundingClientRect();

		cardElements.forEach(el => {
			const rect = el.getBoundingClientRect();
			const elLeft = rect.left - containerRect.left + containerRef.current!.scrollLeft;
			const elTop = rect.top - containerRect.top + containerRef.current!.scrollTop;
			const elRight = elLeft + rect.width;
			const elBottom = elTop + rect.height;

			const selRight = left + width;
			const selBottom = top + height;

			const isIntersecting = !(elRight < left || elLeft > selRight || elBottom < top || elTop > selBottom);

			if (isIntersecting) {
				const id = el.getAttribute('data-item-id');
				if (id) newSet.add(id);
			}
		});

		setSelectedIds(newSet);
		setIsSelecting(false);
		setSelectionBox(null);
	};

	// --- Grouping Logic ---
	const displayedItems = useMemo(() => {
		const sorter = (a: any, b: any) => {
			let dateA = 0;
			if ((a as any).type === 'folder') {
				dateA = Math.max(...(a as SeriesFolder).children.map(c => new Date(c.pubDate || 0).getTime()));
			} else {
				dateA = new Date((a as ContentItem).pubDate || 0).getTime();
			}

			let dateB = 0;
			if ((b as any).type === 'folder') {
				dateB = Math.max(...(b as SeriesFolder).children.map(c => new Date(c.pubDate || 0).getTime()));
			} else {
				dateB = new Date((b as ContentItem).pubDate || 0).getTime();
			}

			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		};

		if (activeSeries) {
			let seriesItems = items.filter(i => i.series === activeSeries);
			if (filter === 'hidden') {
				seriesItems = seriesItems.filter(i => hiddenIds.has(i.id));
			} else {
				seriesItems = seriesItems.filter(i => !hiddenIds.has(i.id));
			}
			return seriesItems.sort(sorter);
		}

		const filtered = items.filter(item => {
			if (filter === 'all') return true;
			return item.collection === filter;
		});

		const seriesMap = new Map<string, SeriesFolder>();
		const rootItems: ContentItem[] = [];

		filtered.forEach(item => {
			if (filter !== 'hidden' && hiddenIds.has(item.id)) return;
			if (filter === 'hidden' && !hiddenIds.has(item.id)) return;

			if (item.series) {
				if (!seriesMap.has(item.series)) {
					const humanTitle = item.series
						.replace(/[-_]/g, ' ')
						.replace(/\b\w/g, c => c.toUpperCase());

					seriesMap.set(item.series, {
						id: item.series,
						title: humanTitle,
						children: [],
						icon: item.icon || item.tags?.[0] || 'folder',
						type: 'folder',
						collection: item.collection,
						pubDate: item.pubDate
					});
				}
				const folder = seriesMap.get(item.series)!;
				folder.children.push(item);

				if (!folder.icon && (item.icon || item.tags?.[0])) {
					folder.icon = item.icon || item.tags?.[0];
				}
				if (item.pubDate && (!folder.pubDate || new Date(item.pubDate) > new Date(folder.pubDate))) {
					folder.pubDate = item.pubDate;
				}

			} else {
				rootItems.push(item);
			}
		});

		let validFolders = Array.from(seriesMap.values());
		if (filter !== 'hidden') {
			validFolders = validFolders.filter(f => !hiddenIds.has(f.id) && f.children.length > 0);
		} else {
			validFolders = validFolders.filter(f => hiddenIds.has(f.id) || f.children.length > 0);
		}

		return [...validFolders, ...rootItems].sort(sorter);

	}, [items, activeSeries, filter, sortOrder, hiddenIds]);

	// --- Selection / Edit Sync ---
	useEffect(() => {
		const timer = setTimeout(() => {
			// Find all items that are either directly selected OR in a selected series (Folder)
			const effectiveItems = items.filter(i =>
				selectedIds.has(i.id) || (i.series && selectedIds.has(i.series))
			);

			if (effectiveItems.length === 0) {
				setEditingItem(null);
			} else if (effectiveItems.length === 1 && selectedIds.size === 1 && selectedIds.has(effectiveItems[0].id)) {
				// True Single Item Selection
				setEditingItem(effectiveItems[0] as ContentItem);
			} else {
				// Bulk Mode
				const selectedItems = effectiveItems;
				const allNew = selectedItems.every(i => i.new);
				const allDraft = selectedItems.every(i => i.draft);

				let commonTags: string[] = [];
				if (selectedItems.length > 0) {
					const firstTags = new Set(selectedItems[0].tags || []);
					if (firstTags.size > 0) {
						commonTags = Array.from(firstTags).filter(tag =>
							selectedItems.every(item => item.tags?.includes(tag))
						);
					}
				}

				const firstIcon = selectedItems[0].icon;
				const allSameIcon = selectedItems.every(i => i.icon === firstIcon);
				const commonIcon = allSameIcon ? firstIcon : '';

				setEditingItem({
					id: 'BULK_EDIT',
					title: `${selectedItems.length} items selected`, // Display count of actual items
					collection: selectedItems[0]?.collection || 'notes',
					filePath: 'MULTIPLE_FILES',
					new: allNew,
					draft: allDraft,
					series: '',
					tags: commonTags,
					icon: commonIcon || '',
					pubDate: ''
				} as ContentItem);
			}
		}, 200);

		return () => clearTimeout(timer);
	}, [selectedIds, items]);

	// --- Handlers ---
	const handleSaveEdit = async () => {
		if (!editingItem) return;

		const isBulk = editingItem.id === 'BULK_EDIT';
		const updatesList: { filePath: string, [key: string]: any }[] = [];
		let newItems = [...items];

		if (isBulk) {
			newItems = newItems.map(item => {
				if (selectedIds.has(item.id) || (item.series && selectedIds.has(item.series))) {
					const updatePayload: any = {
						filePath: item.filePath,
						new: editingItem.new,
						draft: editingItem.draft
					};
					if (editingItem.icon) {
						updatePayload.icon = editingItem.icon;
					}
					updatesList.push(updatePayload);
					return { ...item, ...updatePayload };
				}
				return item;
			});
		} else {
			updatesList.push({
				filePath: editingItem.filePath,
				title: editingItem.title,
				series: editingItem.series,
				tags: editingItem.tags?.filter(Boolean), // Sanitize tags
				icon: editingItem.icon,
				new: editingItem.new,
				draft: editingItem.draft,
				pubDate: editingItem.pubDate
			});
			newItems = newItems.map(i => i.id === editingItem.id ? { ...editingItem, tags: editingItem.tags?.filter(Boolean) } : i);
		}

		setItems(newItems);
		setSelectedIds(new Set());

		try {
			await fetch('/api/admin/update', {
				method: 'POST',
				body: JSON.stringify({ updates: updatesList })
			});
		} catch (e) {
			console.error(e);
		}
	};

	const toggleSelection = (id: string, shift: boolean, toggle: boolean = false) => {
		const newSet = new Set(selectedIds);

		if (shift && lastSelectedId) {
			const currentIndex = displayedItems.findIndex(i => i.id === id);
			const lastIndex = displayedItems.findIndex(i => i.id === lastSelectedId);

			if (currentIndex !== -1 && lastIndex !== -1) {
				const start = Math.min(currentIndex, lastIndex);
				const end = Math.max(currentIndex, lastIndex);
				const range = displayedItems.slice(start, end + 1);

				// Range selection overwrites or unions? Standard is usually Set = Range
				// But let's keep it simple: Add range to current set or reset?
				// macOS Finder: Shift+Click extends selection from anchor.
				// We keep existing selection if Ctrl is held? 
				// Let's assume Shift+Click extends.

				// Correct logic: Clear set if not toggle? No, shift usually extends.
				// If we want "Select Range ONLY", we should clear first?
				// Let's stick to "Add Range".
				
				const shouldSelect = !newSet.has(id); // Simple toggle logic based on target
				range.forEach(item => {
					if ((item as any).type !== 'folder') {
						if (shouldSelect) newSet.add(item.id);
						// else newSet.delete(item.id); // Maybe don't unselect in range?
					}
				});
			}
		} else {
			if (toggle) {
				// Ctrl/Cmd + Click: Toggle specific item
				if (newSet.has(id)) newSet.delete(id);
				else newSet.add(id);
			} else {
				// Normal Click: Select ONLY this item
				newSet.clear();
				newSet.add(id);
			}
		}

		setSelectedIds(newSet);
		setLastSelectedId(id);
	};

	// --- Keyboard Shortcuts ---
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (selectedIds.size === 0 && e.key !== 'Escape') return;
			if ((e.target as HTMLElement).tagName === 'INPUT') return;

			if (e.key.toLowerCase() === 'n') {
				if (editingItem) {
					setEditingItem(prev => prev ? ({ ...prev, new: !prev.new }) : null);
				}
			}
			if (e.key.toLowerCase() === 'd') {
				if (editingItem) {
					setEditingItem(prev => prev ? ({ ...prev, draft: !prev.draft }) : null);
				}
			}
			if (e.key === 'Escape') {
				setSelectedIds(new Set());
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedIds, editingItem]);


	return (
		<div className="p-6 mt-12 font-sans max-w-7xl mx-auto select-none">
			{/* Header & Controls */}
			<header className="mb-8 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{activeSeries ? (
							<button
								onClick={() => { setActiveSeries(null); setSelectedIds(new Set()); }}
								className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
							</button>
						) : (
							<div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
							</div>
						)}
						<div>
							<h1 className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
								{activeSeries ? activeSeries : 'denis-anfruns.dev CMS'}
							</h1>
							<p className="text-xs text-zinc-500 font-mono mt-1">src/content/{activeSeries ? activeSeries : ''}</p>
						</div>
					</div>

					<div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
						<button
							onClick={() => setShowHiddenSidebar(!showHiddenSidebar)}
							className={`px-2 py-1 rounded-[6px] transition-colors ${showHiddenSidebar ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
							title="Toggle Hidden Items Sidebar"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
						</button>
						<div className="w-px bg-zinc-200 dark:bg-zinc-700 mx-1 my-1"></div>
						<button
							onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
							className="px-2 py-1 rounded-[6px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
							title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
						>
							<svg className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
						</button>
						<div className="w-px bg-zinc-200 dark:bg-zinc-700 mx-1 my-1"></div>
						{(['all', 'notes', 'devlogs'] as const).map(f => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-all capitalize
                        ${filter === f
											? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
											: 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
										}`}
							>
								{f}
							</button>
						))}
					</div>
				</div>

				{/* Search Bar */}
				<div className="relative group">
					<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
					<input
						type="text"
						placeholder="Search content..."
						className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder:text-zinc-500"
					/>
				</div>
			</header>

			{/* Grid */}
			{loading ? (
				<div className="flex flex-col items-center justify-center py-32 text-zinc-400 animate-pulse">
					<div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin mb-4"></div>
					<p className="text-sm">Loading content...</p>
				</div>
			) : (
				<div
					ref={containerRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					className="relative min-h-[500px]" // Allow selection area
				>
					{isSelecting && selectionBox && (
						<div
							className="absolute border border-blue-500 bg-blue-500/10 z-50 pointer-events-none"
							style={{
								left: Math.min(selectionBox.start.x, selectionBox.end.x),
								top: Math.min(selectionBox.start.y, selectionBox.end.y),
								width: Math.abs(selectionBox.end.x - selectionBox.start.x),
								height: Math.abs(selectionBox.end.y - selectionBox.start.y),
							}}
						/>
					)}

					<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
						<AnimatePresence mode="popLayout">
							{displayedItems.map((item) => {
								const isFolder = (item as any).type === 'folder';
								const isNote = item.collection === 'notes';

								if (isFolder) {
									const folder = item as SeriesFolder;
									const folderIconColor = isNote ? 'text-emerald-500' : 'text-blue-500';
									const folderRingHover = isNote ? 'group-hover:ring-emerald-500/30' : 'group-hover:ring-blue-500/30';

									return (
										<motion.div
											key={folder.id}
											data-item-id={folder.id}
											layout
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											onClick={(e) => toggleSelection(folder.id, e.shiftKey)}
											onDoubleClick={() => { setActiveSeries(folder.id); setSelectedIds(new Set()); }}
											className={`
                                        cursor-pointer h-32 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 
                                        bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 
                                        transition-all group relative ring-1 ring-transparent overflow-hidden ${folderRingHover}
                                        ${selectedIds.has(folder.id) ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 ring-1 ring-blue-500' : ''}
                                        card-interactive
                                    `}
										>
											<div className="flex flex-col justify-between h-full relative z-10">
												<div className="flex justify-between items-start">
													{folder.icon && folder.icon !== 'folder' ? (
														<div className="w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity">
															<TechIcon name={folder.icon} className="w-full h-full" />
														</div>
													) : (
														<svg className={`w-10 h-10 ${folderIconColor} fill-current opacity-20 group-hover:opacity-100 transition-all duration-300`} viewBox="0 0 24 24"><path d="M20 18c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5.17l1.41 1.41C11.97 6.8 12.47 7 13 7h6c.55 0 1 .45 1 1v10z" /></svg>
													)}
													<div className="flex flex-col items-end gap-1">
														<Badge variant="subtle" size="xs" intent={isNote ? 'emerald' : 'blue'}>SERIES</Badge>
														<button
															onClick={(e) => {
																e.stopPropagation();
																// Toggle all children
																const allChildrenIds = folder.children.map(c => c.id);
																const allHidden = allChildrenIds.every(id => hiddenIds.has(id));
																const newSet = new Set(hiddenIds);

																allChildrenIds.forEach(id => {
																	if (allHidden) newSet.delete(id);
																	else newSet.add(id);
																});
																setHiddenIds(newSet);
															}}
															className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
															title={folder.children.every(c => hiddenIds.has(c.id)) ? "Unhide All" : "Hide All"}
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																{folder.children.every(c => hiddenIds.has(c.id)) ? (
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																) : (
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
																)}
															</svg>
														</button>
													</div>
												</div>
												<div className="flex justify-between items-end">
													<div>
														<h3 className="font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">{folder.title}</h3>
														<span className="text-xs text-zinc-400 font-mono">{folder.children.length} items</span>
													</div>
													{folder.pubDate && (
														<span className="text-xs text-zinc-500 dark:text-white font-mono font-medium whitespace-nowrap pl-2">
															{new Date(folder.pubDate).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
														</span>
													)}
												</div>
											</div>

											{folder.icon && (
												<div className="absolute -bottom-8 -right-8 w-40 h-40 transition-opacity -rotate-12 pointer-events-none opacity-[0.2] dark:opacity-[0.3] group-hover:opacity-[0.4] dark:group-hover:opacity-[0.5]">
													<TechIcon name={folder.icon} className="w-full h-full" />
												</div>
											)}
										</motion.div>
									);
								} else {
									const card = item as ContentItem;
									const isSelected = selectedIds.has(card.id);
									const isDraft = card.draft;
									const iconKey = card.icon || (card as any).tags?.[0] || 'code';

									return (
										<motion.div
											key={card.id}
											data-item-id={card.id}
											layout
											onClick={(e) => toggleSelection(card.id, e.shiftKey, e.ctrlKey || e.metaKey)}
											className={`
                                        cursor-pointer p-0 rounded-2xl border transition-all relative group overflow-hidden h-32 card-interactive
                                        ${isSelected
													? `bg-orange-50 dark:bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/50`
													: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
												}
                                        hover:scale-[1.02] active:scale-[0.98] duration-200
                                    `}
											onDoubleClick={() => setEditingItem(card)}
										>
											<div className={`w-full h-full relative ${isDraft ? 'grayscale group-hover:grayscale-0 transition-all duration-300' : ''}`}>
												<button
													onClick={(e) => toggleHide(card.id, e)}
													className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 dark:bg-black/50 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
													title={filter === 'hidden' ? "Unhide Item" : "Hide Item"}
												>
													{filter === 'hidden' ? (
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
													) : (
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
													)}
												</button>

												{iconKey && (
													<div className={`
                                                absolute -bottom-8 -right-8 w-40 h-40 
                                                transition-opacity -rotate-12 pointer-events-none 
                                                ${isDraft
															? 'opacity-[0.05] group-hover:opacity-[0.1]'
															: 'opacity-[0.2] dark:opacity-[0.3] group-hover:opacity-[0.4] dark:group-hover:opacity-[0.5]'
														}
                                            `}>
														<TechIcon name={iconKey} className="w-full h-full" />
													</div>
												)}

												<div className="p-4 pl-5 h-full flex flex-col justify-between relative z-10">
													<div className="flex justify-between items-start gap-2">
														<h4 className={`font-bold text-sm leading-snug line-clamp-2 capitalize ${isDraft ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-100'}`}>
															{(() => {
																if (card.title) return card.title;
																const parts = card.filePath.split(/[\\/]/);
																let filename = parts.pop();
																if (filename === 'meta.json' || filename === 'index.mdx') {
																	filename = parts.pop() || 'Untitled';
																}
																return filename?.replace('.mdx', '').replace(/[-_]/g, ' ') || 'Untitled';
															})()}
														</h4>
														{card.draft && (
															<Badge intent="warning" size="xs" variant="outline">DRAFT</Badge>
														)}
													</div>

													<div className="flex items-end justify-between">
														<div className="flex gap-2">
															<Badge intent={item.collection === 'notes' ? 'emerald' : 'blue'} variant="subtle" size="xs" shape="square">
																{card.collection.toUpperCase()}
															</Badge>
															{card.new && <Badge intent="danger" size="xs">NEW</Badge>}
														</div>

														<p className="text-[10px] text-zinc-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
															{(() => {
																const fileName = card.filePath.split(/[\\/]/).pop();
																if (fileName === 'meta.json') return '';
																return fileName?.replace('.mdx', '');
															})()}
														</p>

														{card.pubDate && (
															<span className="text-xs text-zinc-500 dark:text-white font-mono font-medium whitespace-nowrap ml-auto pl-2">
																{new Date(card.pubDate).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
															</span>
														)}
													</div>
												</div>
											</div>
										</motion.div>
									)
								}
							})}
						</AnimatePresence>
					</div>
				</div>
			)}

			<AnimatePresence>
				{(selectedIds.size > 0 || editingItem) && (
					<AdminEditSidebar
						editingItem={editingItem}
						setEditingItem={setEditingItem}
						selectedIds={selectedIds}
						setSelectedIds={setSelectedIds}
						items={items}
						setItems={setItems}
						handleSaveEdit={handleSaveEdit}
						displayedItems={displayedItems}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showHiddenSidebar && (
					<AdminHiddenSidebar
						isOpen={showHiddenSidebar}
						onClose={() => setShowHiddenSidebar(false)}
						hiddenIds={hiddenIds}
						items={items}
						onToggleHide={toggleHide}
						onUnhideAll={() => setHiddenIds(new Set())}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
