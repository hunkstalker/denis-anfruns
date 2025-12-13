import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useStore } from '@nanostores/react'
import { isMenuOpen } from '../../stores/menuStore'
import { X } from 'lucide-react'

interface MenuItem {
	label: string
	link: string
	active: boolean
	enabled: boolean
}

interface Props {
	items: MenuItem[]
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
						onPointerDown={(e) => dragControls.start(e)}
						className="fixed top-16 bottom-0 left-0 right-0 z-30 bg-black/50 backdrop-blur-sm touch-none"
					/>

					{/* Menu Panel */}
					<motion.aside
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						drag="x"
						dragControls={dragControls}
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={{ left: 0.5, right: 0.05 }}
						onDragEnd={(_, { offset, velocity }) => {
							if (offset.x < -50 || velocity.x < -500) {
								closeMenu()
							}
						}}
						className="fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
					>
						{/* Filler to hide gap when dragging right */}
						<div className="absolute top-0 bottom-0 right-full w-screen bg-white dark:bg-zinc-900" />
						
						<nav className="flex flex-col gap-1 pt-6">
							{items.map((item) => {
								if (!item.enabled) return null
								return (
									<a
										key={item.link}
										href={item.link}
										onClick={closeMenu}
										className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${item.active
												? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
												: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
											}`}
										aria-current={item.active ? 'page' : undefined}
									>
										{item.label}
									</a>
								)
							})}
						</nav>
					</motion.aside>
				</>
			)}
		</AnimatePresence>,
		document.body
	)
}
