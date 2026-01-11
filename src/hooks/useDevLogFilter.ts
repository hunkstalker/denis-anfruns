import { useState, useEffect, useMemo } from 'react'
import type { DevlogPost } from '@utils/devlogs-content'

export function useDevLogFilter(posts: DevlogPost[]) {
	const [selectedTag, setSelectedTag] = useState<string | null>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			return params.get('tag') || null
		}
		return null
	})

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Update URL when filter changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href)
			if (!selectedTag) {
				url.searchParams.delete('tag')
			} else {
				url.searchParams.set('tag', selectedTag)
			}
			window.history.replaceState(null, '', url.toString())
		}
	}, [selectedTag, mounted])

	const allTags = useMemo(() => {
		const tags = new Set<string>()
		posts.forEach((post) => {
			post.data.tags?.forEach((tag) => tags.add(tag))
		})
		return Array.from(tags).sort()
	}, [posts])

	const filteredPosts = useMemo(() => {
		if (!selectedTag) return posts
		return posts.filter((post) => post.data.tags?.includes(selectedTag))
	}, [posts, selectedTag])

	return {
		selectedTag,
		setSelectedTag,
		allTags,
		filteredPosts,
		mounted,
	}
}
