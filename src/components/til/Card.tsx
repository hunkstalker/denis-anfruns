import { useReadStatus } from '../../hooks/useReadStatus'
import { BADGE_LABELS } from '../../utils/read-status'
import type { TilPost } from '../../utils/til-content'
import { Badge } from '../ui/Badge'
import { ArrowUpRight } from 'lucide-react'
import typescriptSvg from '../../icons/typescript.svg?raw'
import gitSvg from '../../icons/git.svg?raw'
import powerappsSvg from '../../icons/power-apps.svg?raw'
import astroSvg from '../../icons/astro-logo.svg?raw'
import javascriptSvg from '../../icons/javascript.svg?raw'
import viteSvg from '../../icons/vite.svg?raw'

interface Props {
	post: TilPost
	lang: 'es' | 'en' | 'ca'
	index: number
	labels?: {
		readNote: string
	}
	badgeVariant?: 'solid' | 'subtle'
}

// Map icon IDs to their SVG content (key matches tag name or icon field)
const iconSvgs: Record<string, string> = {
	'typescript': typescriptSvg,
	'git': gitSvg,
	'powerapps': powerappsSvg,
	'astro': astroSvg,
	'javascript': javascriptSvg,
	'vite': viteSvg,
}

// Get decorative icons for a TIL (can return multiple for fan effect)
function getDecorativeIcons(post: TilPost): string[] {
	const icons: string[] = []

	// 1. Check explicit icon in frontmatter (single)
	if (post.data.icon && iconSvgs[post.data.icon]) {
		return [iconSvgs[post.data.icon]]
	}

	// 2. Check series (maps to icon automatically)
	if (post.data.series && iconSvgs[post.data.series.split('-')[0]]) {
		return [iconSvgs[post.data.series.split('-')[0]]]
	}

	// 3. Check first matching tag for icon
	if (post.data.tags) {
		for (const tag of post.data.tags) {
			if (iconSvgs[tag]) {
				return [iconSvgs[tag]]
			}
		}
	}

	return icons
}

// Fan rotation angles for multiple icons
const fanRotations = [-25, -5, 15]

export default function TilCard({ post, lang, labels, badgeVariant = 'solid' }: Props) {
	const cleanSlug = post.slug.replace(/(?:\/es|\/en|\/ca)$/, '')
	const href = lang === 'es' ? `/til/${cleanSlug}/` : `/${lang}/til/${cleanSlug}/`

	const readText = labels?.readNote || (lang === 'en' ? 'Read note' : lang === 'ca' ? 'Llegir nota' : 'Leer nota')
	const seriesBadgeText = lang === 'en' ? 'Series' : lang === 'ca' ? 'Sèrie' : 'Serie'

	const badgeStatus = useReadStatus(
		post.slug,
		'til',
		!!post.data.new,
		post.data.allSlugs,
		post.data.newSlugs
	)

	const showBadge = badgeStatus !== null
	const badgeLabel = badgeStatus ? BADGE_LABELS[badgeStatus][lang] : ''

	const decorativeIcons = getDecorativeIcons(post)

	return (
		<article className="til-card group relative flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-zinc-200 bg-stone-100 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-black/15 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900 dark:hover:border-white/15 sm:p-6">
			{/* Full-card clickable link overlay */}
			<a
				href={href}
				className="absolute inset-0 z-10"
				aria-label={post.data.title}
				data-astro-prefetch
			/>

			{/* Decorative technology logos (fanned if multiple) */}
			{decorativeIcons.length > 0 && (
				<div className="pointer-events-none absolute -bottom-8 -right-12 z-0">
					{decorativeIcons.map((svg, index) => {
						const baseRotation = fanRotations[index] ?? (-15 + (index * 15))
						return (
							<div
								key={index}
								className="icon-fan absolute size-44 opacity-[0.12] transition-all duration-500 ease-out group-hover:opacity-[0.35] group-hover:scale-110 dark:opacity-[0.20] dark:group-hover:opacity-[0.45] [&_svg]:size-full"
								style={{
									'--base-rotation': `${baseRotation}deg`,
									'--hover-rotation': `${baseRotation + 10}deg`,
									transform: `rotate(var(--base-rotation))`,
									right: `${index * 20}px`,
									bottom: `${index * 5}px`,
									zIndex: decorativeIcons.length - index,
								} as React.CSSProperties}
								aria-hidden="true"
								dangerouslySetInnerHTML={{ __html: svg }}
							/>
						)
					})}
				</div>
			)}

			{/* Content (below link overlay) */}
			<div className="pointer-events-none relative z-0 mb-1 flex items-center justify-between gap-2">
				<div className="flex items-center gap-3">
					<time
						className="text-xs text-zinc-500"
						dateTime={post.data.pubDate.toISOString()}
					>
						{post.data.pubDate.toLocaleDateString(undefined, {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						})}
					</time>
					{post.data.series && (
						<span className="text-[10px] font-bold uppercase tracking-wider text-[--tangerine]">
							{seriesBadgeText}
						</span>
					)}
				</div>

				{showBadge && (
					<Badge variant={badgeVariant} className="uppercase tracking-wider">
						{badgeLabel}
					</Badge>
				)}
			</div>

			<h3 className="pointer-events-none line-clamp-3 font-semibold leading-snug text-zinc-800 dark:text-zinc-100">
				{post.data.title}
			</h3>

			{post.data.description && (
				<p className="pointer-events-none mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
					{post.data.description}
				</p>
			)}

			<div className="pointer-events-none mt-auto flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
				{readText}
				<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
			</div>
		</article>
	)
}

