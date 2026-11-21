import type { PastEvent, Post, PublicEvent } from './types'

export function parseImageUrls(urls: string[] | string | undefined | null): string[] {
  if (!urls) return []

  const values = Array.isArray(urls) ? urls : [urls]
  return values.flatMap((value) => {
    if (typeof value !== 'string') return []
    const trimmed = value.trim()
    if (/^https?:\/\//i.test(trimmed)) return [trimmed]
    return trimmed.match(/https?:\/\/[^'" ,\]]+/gi) ?? []
  })
}

export function parseEventDate(value?: string): Date | null {
  if (!value) return null

  // Event timestamps are wall-clock values entered in Vietnam and stored in a
  // PostgreSQL column without timezone information. Attach UTC+07 explicitly
  // so classification is identical on local, CI and production servers.
  const isLocalDatabaseTimestamp = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(
    value
  )
  const normalized = isLocalDatabaseTimestamp ? `${value.replace(' ', 'T')}+07:00` : value
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getUpcomingPublicEvent(
  events: PublicEvent[],
  referenceTime: string
): PublicEvent | null {
  const now = new Date(referenceTime).getTime()

  return (
    events
      .map((event) => ({ event, date: parseEventDate(event.events_date) }))
      .filter(({ date }) => date !== null && date.getTime() >= now)
      .sort((a, b) => a.date!.getTime() - b.date!.getTime())[0]?.event ?? null
  )
}

export function buildPastEvents(
  publicEvents: PublicEvent[],
  posts: Post[],
  referenceTime: string
): PastEvent[] {
  const now = new Date(referenceTime).getTime()
  const pastPublicEvents = publicEvents.filter((event) => {
    const date = parseEventDate(event.events_date)
    return date === null || date.getTime() < now
  })

  return [
    ...pastPublicEvents.map((event) => ({
      id: `pe-${event.id}`,
      type: 'public_event' as const,
      title: event.title,
      summary: event.summary || event.description,
      cover: event.img_url,
      date: event.events_date || event.created_at,
      facebook_url: event.facebook_url,
    })),
    ...posts.map((post) => ({
      id: `post-${post.id}`,
      type: 'post' as const,
      title: post.title,
      summary: post.summary || post.description,
      cover: parseImageUrls(post.img_urls)[0],
      date: post.events_date || post.created_at,
      facebook_url: post.facebook_url,
    })),
  ].sort((a, b) => {
    const aTime = parseEventDate(a.date)?.getTime() ?? 0
    const bTime = parseEventDate(b.date)?.getTime() ?? 0
    return bTime - aTime
  })
}
