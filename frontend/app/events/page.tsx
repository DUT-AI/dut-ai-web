import { genPageMetadata } from 'app/seo'
import {
  getPublicEventsCached as getPublicEvents,
  getPostsCached as getPosts,
} from '@/lib/db/cached-queries'
import type { PublicEvent, Post } from '@/lib/db/features/events/types'
import { buildPastEvents } from '@/lib/db/features/events/timeline'
import EventsListLayout from '@/layouts/EventsListLayout'

export const metadata = genPageMetadata({
  title: 'Sự kiện và hoạt động AI',
  description:
    'Theo dõi các sự kiện, workshop, seminar, cuộc thi và hoạt động cộng đồng của DUT AI Club tại Đà Nẵng.',
  path: '/events',
})

export const revalidate = 60

const EVENTS_PER_PAGE = 5

export default async function EventsPage() {
  const referenceTime = new Date().toISOString()
  let publicEvents: PublicEvent[] = []
  let posts: Post[] = []
  let error = false

  try {
    ;[publicEvents, posts] = await Promise.all([getPublicEvents(), getPosts()])
  } catch {
    error = true
  }

  const allPastEvents = buildPastEvents(publicEvents, posts, referenceTime)

  const totalPages = Math.ceil(allPastEvents.length / EVENTS_PER_PAGE)
  const initialDisplayPosts = allPastEvents.slice(0, EVENTS_PER_PAGE)
  const pagination = { currentPage: 1, totalPages }

  return (
    <EventsListLayout
      publicEvents={publicEvents}
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      error={error}
      referenceTime={referenceTime}
    />
  )
}
