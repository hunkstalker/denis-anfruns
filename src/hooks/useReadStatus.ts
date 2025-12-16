import { useState, useEffect } from 'react'
import { getBadgeStatus, type BadgeStatus, type CollectionType } from '@utils/read-status'

export function useReadStatus(
  slug: string,
  collection: CollectionType,
  isNew: boolean,
  allSlugs?: string[],
  newSlugs?: string[]
) {
  const [status, setStatus] = useState<BadgeStatus>(null)

  useEffect(() => {
    // Optimization: if not "new", never show badge
    if (!isNew) {
      setStatus(null)
      return
    }

    const checkStatus = () => {
      const s = getBadgeStatus(slug, collection, allSlugs, newSlugs)
      setStatus(s)
    }

    checkStatus()

    const handleUpdate = () => {
      // We could filter by collection in the event detail, 
      // but checking everything is cheap enough for now.
      checkStatus()
    }

    window.addEventListener('read-status-changed', handleUpdate)
    window.addEventListener('pageshow', checkStatus) // Handle BFCache

    // Listen to storage events (cross-tab sync)
    window.addEventListener('storage', checkStatus)

    return () => {
      window.removeEventListener('read-status-changed', handleUpdate)
      window.removeEventListener('pageshow', checkStatus)
      window.removeEventListener('storage', checkStatus)
    }
  }, [slug, collection, isNew, allSlugs, newSlugs])

  return status
}
