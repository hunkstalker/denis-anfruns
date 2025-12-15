import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownItem {
	label: string
	link: string
	active: boolean
	enabled: boolean
}

interface NavDropdownProps {
	label: string
	link: string
	active: boolean
	enabled: boolean
	items: DropdownItem[]
	className?: string
}

const NavDropdown = ({ label, link, active, items, className }: NavDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

	const handleMouseEnter = () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
			setTimeoutId(null)
		}
		setIsOpen(true)
	}

	const handleMouseLeave = () => {
		const id = setTimeout(() => {
			setIsOpen(false)
		}, 300) // 300ms gracetime
		setTimeoutId(id)
	}

	// Base classes matching Button.astro structure but WITHOUT margins (margins moved to wrapper)
	const baseClasses =
		'relative py-3 px-4 text-sm md:text-lg font-medium rounded-lg transition-[background-color] duration-200 no-underline leading-normal inline-block text-center'

	// Active/Enabled logic matching Button.astro
	const stateClasses = active
		? 'text-zinc-900 dark:text-white bg-zinc-300 dark:bg-zinc-800'
		: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'

	return (
		<div
			className="relative m-2 inline-block text-left"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Main Button / Link - Matching Button.astro structure */}
			<a
				href={link}
				className={`${baseClasses} ${stateClasses} ${className || ''}`}
				aria-expanded={isOpen}
			>
				{label}
			</a>

			{/* Dropdown Panel */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, x: '-50%' }}
						animate={{ opacity: 1, y: 0, x: '-50%' }}
						exit={{ opacity: 0, y: 10, x: '-50%' }}
						transition={{ duration: 0.2 }}
						className="absolute left-1/2 top-full mt-2 w-48 rounded-xl border border-zinc-200/50 bg-[#f8f6f3] p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 dark:ring-white/10"
					>
						<div className="flex flex-col gap-1">
							{items.map((item, index) => (
								<a
									key={index}
									href={item.link}
									data-astro-prefetch
									className={`block rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
										item.active
											? 'bg-zinc-300 font-medium text-zinc-900 dark:bg-white/10 dark:text-white'
											: 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200'
									}`}
								>
									{item.label}
								</a>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default NavDropdown
