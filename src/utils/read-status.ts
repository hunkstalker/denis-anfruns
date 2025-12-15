export type BadgeStatus = 'NEW' | 'UPDATED' | null
export type CollectionType = 'blog' | 'til'

const getStorageKey = (collection: CollectionType) =>
	collection === 'blog' ? 'blog:read-posts' : 'til:read-posts'

export function getReadPosts(collection: CollectionType): string[] {
	if (typeof localStorage === 'undefined') return []
	try {
		const key = getStorageKey(collection)
		return JSON.parse(localStorage.getItem(key) || '[]')
	} catch (e) {
		console.error('Error reading localStorage', e)
		return []
	}
}

export function markPostAsRead(slug: string, collection: CollectionType) {
	if (typeof localStorage === 'undefined') return

	const key = getStorageKey(collection)
	const readPosts = getReadPosts(collection)

	if (!readPosts.includes(slug)) {
		readPosts.push(slug)
		localStorage.setItem(key, JSON.stringify(readPosts))
		// Dispatch event for specialized hooks
		window.dispatchEvent(new CustomEvent('read-status-changed', {
			detail: { slug, collection }
		}))
	}
}

export function getBadgeStatus(
	slug: string,
	collection: CollectionType,
	allSlugs?: string[], // All slugs in the series (including current)
	newSlugs?: string[]  // Slugs marked as "new"
): BadgeStatus {
	// Basic logic: if no new content, return null
	// But wait, the previous logic relied on post.data.new flag being true on the item itself.
	// The card passes `post.data.new`.
	// Actually, the new logic we aligned on is:
	// 1. Is there ANY unread content in the "newSlugs"?
	//    If newSlugs is empty, check the slug itself.

	// We need to know if the post itself is "new" to even consider showing a badge.
	// But the Card only calls this if `post.data.new` is true.
	// Let's assume the caller filters by `post.data.new` first, or we pass it in.

	// Actually, simpler:
	// The "UPDATED" vs "NEW" distinction depends on if the user has read ANY part of the series.

	const readPosts = getReadPosts(collection)

	// 1. Determine relevant unread content
	const relevantSlugs = (newSlugs && newSlugs.length > 0) ? newSlugs : [slug]

	const hasUnreadContent = relevantSlugs.some(s => !readPosts.includes(s))

	if (!hasUnreadContent) return null

	// 2. Determine label based on history
	// If user has read ANY part of the series (allSlugs), it's UPDATED.
	// If user has read NOTHING, it's NEW.

	const seriesSlugs = (allSlugs && allSlugs.length > 0) ? allSlugs : [slug]
	const hasReadAny = seriesSlugs.some(s => readPosts.includes(s))

	return hasReadAny ? 'UPDATED' : 'NEW'
}

export const BADGE_LABELS = {
	NEW: {
		en: 'NEW',
		es: 'NUEVO',
		ca: 'NOU'
	},
	UPDATED: {
		en: 'UPDATED',
		es: 'ACTUALIZADO',
		ca: 'ACTUALITZAT'
	}
} as const
