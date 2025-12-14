import { motion } from 'framer-motion'
import TilCard from './Card'
import type { TilPost } from '../../utils/til-content'

interface Props {
	posts: TilPost[]
	lang: 'es' | 'en' | 'ca'
	labels: {
		readNote: string
	}
}

export default function BlogTilList({ posts, lang, labels }: Props) {
	return (
		<div className="grid gap-4 sm:gap-6 lg:gap-8">
			{posts.map((post, index) => (
				<motion.div
					key={post.slug}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: index * 0.1 }}
				>
					<TilCard post={post} lang={lang} index={index} labels={labels} />
				</motion.div>
			))}
		</div>
	)
}
