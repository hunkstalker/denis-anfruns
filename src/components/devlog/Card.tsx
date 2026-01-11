import { useReadStatus } from '@hooks/useReadStatus'
import { BADGE_LABELS } from '@utils/read-status'
import type { DevlogPost } from '@utils/devlogs-content'
import { getBaseSlug } from '@utils/blogi18n'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '../ui/Badge'
import typescriptSvg from '@icons/tech/typescript.svg?raw'
import gitSvg from '@icons/tech/git.svg?raw'
import powerappsSvg from '@icons/tech/power-apps.svg?raw'
import astroSvg from '@icons/tech/astro-logo.svg?raw'
import javascriptSvg from '@icons/tech/javascript.svg?raw'
import viteSvg from '@icons/tech/vite.svg?raw'

interface Props {
	post: DevlogPost
	lang: 'es' | 'en' | 'ca'
	index?: number
	labels: {
		readArticle: string
	}
	layout?: 'grid' | 'blogList'
}

// Map icon IDs to their SVG content
const iconSvgs: Record<string, string> = {
	typescript: typescriptSvg,
	git: gitSvg,
	powerapps: powerappsSvg,
	astro: astroSvg,
	javascript: javascriptSvg,
	vite: viteSvg,
}

// Get decorative icons for a Devlog
function getDecorativeIcons(post: DevlogPost): string[] {
	const icons: string[] = []

	// 1. Check explicit icon in frontmatter
	if (post.data.icon && iconSvgs[post.data.icon]) {
		return [iconSvgs[post.data.icon]]
	}

	// 2. Check series (maps to icon automatically)
	if (post.data.series && iconSvgs[post.data.series.split('-')[0]]) {
		return [iconSvgs[post.data.series.split('-')[0]]]
	}

	// 3. Check tags
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

export default function DevLogCard({ post, lang, labels, layout = 'grid' }: Props) {
	const href =
		lang === 'es'
			? `/devlogs/${getBaseSlug(post.slug)}/`
			: `/${lang}/devlogs/${getBaseSlug(post.slug)}/`

	const image = post.data.heroImage || post.data.ogImage

	const badgeStatus = useReadStatus(
		post.slug,
		'devlogs',
		!!post.data.new,
		post.data.allSlugs,
		post.data.newSlugs
	)

	const showBadge = badgeStatus !== null
	const badgeLabel = badgeStatus ? BADGE_LABELS[badgeStatus][lang] : ''

	const decorativeIcons = getDecorativeIcons(post)

	// Esta es la lista de las cards en /blog/devlog
	if (layout === 'blogList') {
		return (
			<article className="group relative flex flex-col gap-3 overflow-hidden rounded-lg border border-zinc-200 bg-stone-100 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900 dark:hover:border-zinc-600 sm:p-6">
				{/* Decorative technology logos (fanned if multiple) */}
				{decorativeIcons.length > 0 && (
					<div className="pointer-events-none absolute -bottom-8 -right-12 z-0">
						{decorativeIcons.map((svg, index) => {
							const baseRotation = fanRotations[index] ?? -15 + index * 15
							return (
								<div
									key={index}
									className="icon-fan absolute size-44 opacity-[0.12] transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-[0.35] dark:opacity-[0.20] dark:group-hover:opacity-[0.45] [&_svg]:size-full"
									style={
										{
											'--base-rotation': `${baseRotation}deg`,
											'--hover-rotation': `${baseRotation + 10}deg`,
											transform: `rotate(var(--base-rotation))`,
											right: `${index * 20}px`,
											bottom: `${index * 5}px`,
											zIndex: decorativeIcons.length - index,
										} as React.CSSProperties
									}
									aria-hidden="true"
									dangerouslySetInnerHTML={{ __html: svg }}
								/>
							)
						})}
					</div>
				)}
				<div className="text-xs mb-2 flex items-center gap-3 text-zinc-500">

					<time dateTime={post.data.pubDate.toISOString()}>
						{post.data.pubDate.toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</time>
					{/* Tags hidden in list mode to keep it compact, or show only 1 */}
					{post.data.tags.slice(0,3).map((tag, index) => (
						<Badge key={tag} variant="subtle" intent="blue" size="md" shape="square" className={`${index > 0 ? 'hidden sm:block' : ''}`}>
							{tag}
						</Badge>
					))}
					<div className="ml-auto">
						{showBadge && (
							<Badge variant="subtle" className="uppercase tracking-wider">
								{badgeLabel}
							</Badge>
						)}
					</div>
				</div>

				<h3 className="text-lg font-bold transition-colors dark:text-white">
					<a href={href} data-astro-prefetch>
						<span className="absolute inset-0"></span>
						{typeof post.data.seriesTitle === 'string' ? post.data.seriesTitle : post.data.title}
					</a>
				</h3>

				<p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
					{post.data.description}
				</p>

				<div className="pointer-events-none mt-2 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
					{labels.readArticle}
					<ArrowUpRight className="size-4" />
				</div>
			</article>
		)
	}

	// Esta es el grid de las cards en /devlog
	return (
		<article className="devlog-card group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-stone-100 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-700/50 dark:bg-zinc-900 dark:hover:border-zinc-600">
			{/* Stretched link for full-card click */}
			<a href={href} data-astro-prefetch className="absolute inset-0 z-10" aria-label={post.data.title} />
			
			<div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
				{image && (
					<img
						src={image}
						alt={post.data.title}
						className="size-full object-cover transition-transform duration-500 group-hover:scale-125"
						loading="lazy"
					/>
				)}
				{/* Overlay Gradient */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

				{/* Content Overlay */}
				<div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
					<div className="mb-2 flex items-center gap-2">
						{showBadge && (
							<Badge variant="solid" className="uppercase tracking-wider">
								{badgeLabel}
							</Badge>
						)}
						{post.data.tags.slice(0, 3).map((tag, index) => (
							<Badge
								key={tag}
								variant="solid"
								intent="glass"
								size="md"
								shape="square"
								className={`backdrop-blur-sm ${index > 0 ? 'hidden md:inline-flex' : ''}`}
							>
								{tag}
							</Badge>
						))}
					</div>

					<h3 className="text-xl font-bold leading-tight text-white">
						{post.data.title}
					</h3>

					{/* Date in overlay */}
					<time dateTime={post.data.pubDate.toISOString()} className="text-xs mt-2 text-zinc-300">
						{post.data.pubDate.toLocaleDateString(undefined, {
							month: 'long',
							day: 'numeric',
							year: 'numeric',
						})}
					</time>
				</div>
			</div>

			<div className="flex flex-1 flex-col p-4">
				<p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
					{post.data.description}
				</p>

				<div className="mt-3 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
					{labels.readArticle}
					<ArrowUpRight className="size-4" />
				</div>
			</div>
		</article>
	)
}
