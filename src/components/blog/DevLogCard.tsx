import type { DevlogPost } from '../../utils/devlog-content'
import { getBaseSlug } from '../../utils/blogi18n'
import { ArrowUpRight } from 'lucide-react'

interface Props {
	post: DevlogPost
	lang: 'es' | 'en' | 'ca'
	index?: number
	labels: {
		readArticle: string
	}
}

export default function DevLogCard({ post, lang, labels }: Props) {
	const href =
		lang === 'es'
			? `/devlog/${getBaseSlug(post.slug)}/`
			: `/${lang}/devlog/${getBaseSlug(post.slug)}/`

	return (
		<article className="devlog-card group relative flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:border-black/15 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-white/15 sm:gap-6 sm:rounded-2xl sm:p-6">
			<div className="flex-1">
				<div className="text-xs mb-3 flex items-center gap-3 text-zinc-500">
					<time dateTime={post.data.pubDate.toISOString()}>
						{post.data.pubDate.toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</time>
					{post.data.tags.slice(0, 3).map((tag, index) => (
						<span
							key={tag}
							className={`rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ${
								index > 0 ? 'hidden md:block' : ''
							}`}
						>
							{tag}
						</span>
					))}
				</div>

				<h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-[--tangerine-hover] dark:text-white">
					<a href={href}>
						<span className="absolute inset-0"></span>
						{post.data.title}
					</a>
				</h3>

				<p className="mb-4 line-clamp-2 text-zinc-600 dark:text-zinc-400">
					{post.data.description}
				</p>

				<div className="flex items-center gap-2 text-sm font-medium text-[--tangerine-hover] dark:text-[--tangerine]">
					{labels.readArticle}
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
			</div>
		</article>
	)
}
