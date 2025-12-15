import type { TilPost } from '../../utils/til-content'
import { ArrowUpRight } from 'lucide-react'
import typescriptSvg from '../../icons/typescript.svg?raw'
import gitSvg from '../../icons/git.svg?raw'

interface Props {
	post: TilPost
	lang: 'es' | 'en' | 'ca'
	index: number
	labels?: {
		readNote: string
	}
}

// Map icon IDs to their SVG content
const iconSvgs: Record<string, string> = {
	'typescript': typescriptSvg,
	'git': gitSvg,
}

// Get the decorative SVG for a TIL
function getDecorativeSvg(post: TilPost): string | null {
	// 1. Check explicit icon in frontmatter
	if (post.data.icon && iconSvgs[post.data.icon]) {
		return iconSvgs[post.data.icon]
	}
	
	// 2. Check series (maps to icon automatically)
	if (post.data.series && iconSvgs[post.data.series.split('-')[0]]) {
		return iconSvgs[post.data.series.split('-')[0]]
	}
	
	return null
}

export default function TilCard({ post, lang, labels }: Props) {
	const cleanSlug = post.slug.replace(/(?:\/es|\/en|\/ca)$/, '')
	const href = lang === 'es' ? `/til/${cleanSlug}/` : `/${lang}/til/${cleanSlug}/`

	const readText = labels?.readNote || (lang === 'en' ? 'Read note' : lang === 'ca' ? 'Llegir nota' : 'Leer nota')
	const badgeText = lang === 'en' ? 'UPDATED' : lang === 'ca' ? 'ACTUALITZAT' : 'ACTUALIZADO'
	const seriesBadgeText = lang === 'en' ? 'Series' : lang === 'ca' ? 'Sèrie' : 'Serie'

	const decorativeSvg = getDecorativeSvg(post)

	return (
		<article className="til-card group relative flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-black/15 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-white/15 sm:p-6">
			{/* Decorative technology logo */}
			{decorativeSvg && (
				<div 
					className="pointer-events-none absolute -bottom-8 -right-12 z-0 size-44 rotate-[-15deg] opacity-[0.12] transition-all duration-500 ease-out group-hover:opacity-[0.4] group-hover:scale-110 group-hover:rotate-[-8deg] dark:opacity-[0.25] dark:group-hover:opacity-[0.5] [&_svg]:size-full [&_svg]:text-[--tangerine]"
					aria-hidden="true"
					dangerouslySetInnerHTML={{ __html: decorativeSvg }}
				/>
			)}

			<div className="relative z-10 mb-1 flex items-center justify-between gap-2">
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

				{post.data.new && (
					<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
						{badgeText}
					</span>
				)}
			</div>

			<h3 className="relative z-10 line-clamp-3 font-semibold leading-snug text-zinc-800 dark:text-zinc-100">
				<a href={href} className="before:absolute before:inset-0" data-astro-prefetch>
					{post.data.title}
				</a>
			</h3>

			{post.data.description && (
				<p className="relative z-10 mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
					{post.data.description}
				</p>
			)}

			<div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
				{readText}
				<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
			</div>
		</article>
	)
}

