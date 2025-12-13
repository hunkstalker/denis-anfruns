import { motion } from 'framer-motion'
import DevLogCard from './DevLogCard'
import type { DevlogPost } from '../../utils/devlog-content'

interface Props {
	posts: DevlogPost[]
	lang: 'es' | 'en' | 'ca'
	labels: {
		readArticle: string
	}
}

export default function BlogDevLogList({ posts, lang, labels }: Props) {
	return (
		<div className="grid gap-4 sm:gap-6 lg:gap-8">
			{posts.map((post, index) => (
				<motion.div
					key={post.slug}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: index * 0.1 }}
				>
					<DevLogCard post={post} lang={lang} labels={labels} />
				</motion.div>
			))}
		</div>
	)
}
