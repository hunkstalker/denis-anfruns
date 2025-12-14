import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useStore } from '@nanostores/react'
import { isMenuOpen } from '../../stores/menuStore'
import { X, ChevronDown } from 'lucide-react'

interface MenuItem {
	label: string
	link: string
	active: boolean
	enabled: boolean
    children?: MenuItem[]
}

interface Props {
	items: MenuItem[]
}

const MobileMenuItem = ({ item, closeMenu }: { item: MenuItem; closeMenu: () => void }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const hasChildren = item.children && item.children.length > 0

	if (hasChildren) {
		return (
			<div className='flex flex-col'>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
						item.active
							? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
							: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
					}`}>
					{item.label}
					<ChevronDown
						className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
					/>
				</button>
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className='overflow-hidden pl-4'>
							<div className='flex flex-col gap-1 border-l border-zinc-200 pl-2 dark:border-zinc-700'>
								{item.children?.map(child => (
									<a
										key={child.link}
										href={child.link}
										onClick={closeMenu}
										data-astro-prefetch
										className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
											child.active
												? 'text-[--tangerine] dark:text-[--tangerine]'
												: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
										}`}>
										{child.label}
									</a>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		)
	}

	return (
		<a
			href={item.link}
			onClick={closeMenu}
			data-astro-prefetch
			className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
				item.active
					? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
					: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
			}`}
			aria-current={item.active ? 'page' : undefined}>
			{item.label}
		</a>
	)
}

export default function MobileMenu({ items }: Props) {
	const $isMenuOpen = useStore(isMenuOpen)
	const [mounted, setMounted] = useState(false)
	const dragControls = useDragControls()

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	// Bloquear scroll cuando el menú está abierto
	useEffect(() => {
		if ($isMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}, [$isMenuOpen])

	const closeMenu = () => isMenuOpen.set(false)

	if (!mounted) return null

	return createPortal(
		<AnimatePresence>
			{$isMenuOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={closeMenu}
						onPointerDown={e => dragControls.start(e)}
						className='fixed bottom-0 left-0 right-0 top-16 z-30 touch-none bg-black/50 backdrop-blur-sm'
					/>

					{/* Menu Panel */}
					<motion.aside
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						drag='x'
						dragControls={dragControls}
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={{ left: 0.5, right: 0.05 }}
						onDragEnd={(_, { offset, velocity }) => {
							if (offset.x < -50 || velocity.x < -500) {
								closeMenu()
							}
						}}
						className='fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900'>
						{/* Filler to hide gap when dragging right */}
						<div className='absolute bottom-0 right-full top-0 w-screen bg-white dark:bg-zinc-900' />

						<nav className='flex flex-col gap-1 pt-6'>
							{items.map(item => {
								if (!item.enabled) return null
								return <MobileMenuItem key={item.link} item={item} closeMenu={closeMenu} />
							})}
						</nav>
					</motion.aside>
				</>
			)}
		</AnimatePresence>,
		document.body,
	)
}
