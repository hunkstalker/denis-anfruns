import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: 'solid' | 'subtle'
	intent?: 'emerald' | 'blue' | 'glass' | 'tangerine'
	size?: 'xs' | 'sm' | 'md' // xs=10px, sm=12px, md=14px
	shape?: 'pill' | 'square'
	className?: string
}

// Design Tokens for Badges
export const BADGE_STYLES = {
	base: 'inline-flex items-center justify-center font-bold transition-colors',
	shapes: {
		pill: 'rounded-full',
		square: 'rounded-md',
	},
	sizes: {
		xs: 'px-2 py-0.5 text-[10px]',
		sm: 'px-2.5 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm',
	},
	variants: {
		solid: {
			emerald: 'bg-emerald-600/90 text-white border border-emerald-500/30 backdrop-blur-sm shadow-sm',
			blue: 'bg-blue-600/90 text-white border border-blue-500/30 backdrop-blur-sm shadow-sm',
			glass: 'bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20',
			tangerine: 'bg-[--tangerine] text-zinc-900 border border-[--tangerine]/30 shadow-sm',
		},
		subtle: {
			emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
			blue: 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30',
			glass: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
			tangerine: 'bg-[--tangerine]/10 text-[--tangerine-hover] dark:text-[--tangerine] border border-[--tangerine]/20',
		},
	},
}

export const Badge = ({
	variant = 'subtle',
	intent = 'emerald',
	size = 'xs',
	shape = 'pill',
	className = '',
	children,
	...props
}: BadgeProps) => {
	const variantClass = BADGE_STYLES.variants[variant]?.[intent] || BADGE_STYLES.variants[variant].emerald
	const baseClass = BADGE_STYLES.base
	const sizeClass = BADGE_STYLES.sizes[size]
	const shapeClass = BADGE_STYLES.shapes[shape]

	// Simple class merging
	const combinedClassName = `${baseClass} ${shapeClass} ${sizeClass} ${variantClass} ${className}`

	return (
		<span className={combinedClassName} {...props}>
			{children}
		</span>
	)
}
