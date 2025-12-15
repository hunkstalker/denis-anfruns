import { useEffect } from 'react'

export function useIntersectionObserver({
	target,
	onIntersect,
	threshold = 0.1,
	rootMargin = '0px',
	enabled = true,
}: {
	target: React.RefObject<Element | null>
	onIntersect: () => void
	threshold?: number
	rootMargin?: string
	enabled?: boolean
}) {
	useEffect(() => {
		if (!enabled) return

		const element = target.current
		if (!element) return

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						onIntersect()
					}
				})
			},
			{
				threshold,
				rootMargin,
			},
		)

		observer.observe(element)

		return () => {
			observer.unobserve(element)
			observer.disconnect()
		}
	}, [target, onIntersect, threshold, rootMargin, enabled])
}
