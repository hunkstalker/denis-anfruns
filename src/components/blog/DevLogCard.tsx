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
    layout?: 'grid' | 'list'
}

export default function DevLogCard({ post, lang, labels, layout = 'grid' }: Props) {
	const href =
		lang === 'es'
			? `/devlog/${getBaseSlug(post.slug)}/`
			: `/${lang}/devlog/${getBaseSlug(post.slug)}/`

    const image = post.data.heroImage || post.data.ogImage

    if (layout === 'list') {
        return (
            <article className="group relative flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-zinc-600 sm:p-6">
				<div className="text-xs mb-2 flex items-center gap-3 text-zinc-500">
					<time dateTime={post.data.pubDate.toISOString()}>
						{post.data.pubDate.toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</time>
                    {/* Tags hidden in list mode to keep it compact, or show only 1 */}
					{post.data.tags.slice(0, 1).map((tag) => (
						<span
							key={tag}
							className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
						>
							{tag}
						</span>
					))}
				</div>

				<h3 className="text-lg font-bold transition-colors dark:text-white">
					<a href={href}>
						<span className="absolute inset-0"></span>
						{post.data.title}
					</a>
				</h3>

				<p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
					{post.data.description}
				</p>

				<div className="mt-2 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
					{labels.readArticle}
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
            </article>
        )
    }

	return (
		<article className="devlog-card group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-zinc-600">
            {image && (
                <div className="hidden sm:block aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img 
                        src={image} 
                        alt={post.data.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
            )}
			<div className="flex flex-1 flex-col p-4 sm:p-6">
				<div className="mb-3 flex items-center gap-3 text-xs text-zinc-500">
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

				<h3 className="mb-2 text-xl font-bold transition-colors dark:text-white">
					<a href={href}>
						<span className="absolute inset-0"></span>
						{post.data.title}
					</a>
				</h3>

				<p className="mb-4 line-clamp-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
					{post.data.description}
				</p>

				<div className="mt-auto flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[--tangerine-hover] dark:group-hover:text-[--tangerine]">
					{labels.readArticle}
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
			</div>
		</article>
	)
}
