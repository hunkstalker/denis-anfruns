import { useStore } from '@nanostores/react'
import { isMenuOpen } from '@stores/menuStore'
import { Menu, X } from 'lucide-react'

interface Props {
	label: string
}

export default function MenuToggle({ label }: Props) {
	const $isMenuOpen = useStore(isMenuOpen)

	return (
		<button
			onClick={() => isMenuOpen.set(!$isMenuOpen)}
			aria-label={label}
			className="p-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
		>
			{$isMenuOpen ? <X size={24} /> : <Menu size={24} />}
		</button>
	)
}
