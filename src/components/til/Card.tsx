import type { TilPost } from '../../utils/til-content'
import { ArrowUpRight } from 'lucide-react'

interface Props {
	post: TilPost
	lang: 'es' | 'en' | 'ca'
	index: number
	labels?: {
		readNote: string
	}
}

export default function TilCard({ post, lang, labels }: Props) {
	const href =
		lang === 'es' ? `/til/${post.slug.split('/')[0]}/` : `/${lang}/til/${post.slug.split('/')[0]}/`

	const readText =
		labels?.readNote || (lang === 'en' ? 'Read note' : lang === 'ca' ? 'Llegir nota' : 'Leer nota')

	return (
		<article className="til-card group relative flex h-full flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:border-black/15 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-white/15 sm:p-6">
			<div className="mb-1 flex items-center justify-between gap-2">
				<time
					className="text-xs flex items-center gap-3 text-zinc-500"
					dateTime={post.data.pubDate.toISOString()}
				>
					{post.data.pubDate.toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
					})}
				</time>
			</div>

			<h3 className="mb-4 line-clamp-3 font-semibold leading-snug text-zinc-800 dark:text-zinc-100">
				<a href={href} className="before:absolute before:inset-0" data-astro-prefetch>
					{post.data.title}
				</a>
			</h3>

			<div className="mt-auto flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
				{readText}
				<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</div>
		</article>
	)
}
