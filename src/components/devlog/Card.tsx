import { useReadStatus } from '@hooks/useReadStatus'
import { BADGE_LABELS } from '@utils/read-status'
import type { DevlogPost } from '@utils/devlogs-content'
import { getBaseSlug } from '@utils/blogi18n'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '../ui/Badge'

interface Props {
	post: DevlogPost
	lang: 'es' | 'en' | 'ca'
	index?: number
	labels: {
		readArticle: string
	}
	layout?: 'grid' | 'blogList'
}

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

	// Esta es la lista de las cards en /blog/devlog
	if (layout === 'blogList') {
		return (
			<article className="group relative flex flex-col gap-3 rounded-lg border border-zinc-200 bg-stone-100 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900 dark:hover:border-zinc-600 sm:p-6">
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
