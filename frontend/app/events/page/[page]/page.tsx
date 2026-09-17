import { notFound } from 'next/navigation'
import {
  getPostsCached as getPosts,
  getPublicEventsCached as getPublicEvents,
} from '@/lib/db/cached-queries'
import { buildPastEvents } from '@/lib/db/features/events/timeline'
import type { Post, PublicEvent } from '@/lib/db/features/events/types'
import EventsListLayout from '@/layouts/EventsListLayout'
import { genPageMetadata } from 'app/seo'

const EVENTS_PER_PAGE = 5

export const generateMetadata = async ({ params }: { params: Promise<{ page: string }> }) => {
  const { page } = await params
  const pageNumber = Number(page)
  const validPage = /^\d+$/.test(page) && Number.isSafeInteger(pageNumber) && pageNumber > 0
  return genPageMetadata({
    title: validPage ? `Sự kiện — Trang ${pageNumber}` : 'Trang sự kiện không tồn tại',
    description: 'Tất cả sự kiện, workshop, cuộc thi và hoạt động của DUT AI Club tại Đà Nẵng.',
    path: pageNumber === 1 ? '/events' : `/events/page/${page}`,
    noIndex: !validPage,
  })
}

export const dynamic = 'force-dynamic'

export default async function EventsPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  if (!/^\d+$/.test(page)) notFound()

  const pageNumber = Number(page)
  if (!Number.isSafeInteger(pageNumber) || pageNumber < 1) notFound()

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
  const totalPages = Math.max(1, Math.ceil(allPastEvents.length / EVENTS_PER_PAGE))
  if (pageNumber > totalPages) notFound()

  const initialDisplayPosts = allPastEvents.slice(
    EVENTS_PER_PAGE * (pageNumber - 1),
    EVENTS_PER_PAGE * pageNumber
  )

  return (
    <EventsListLayout
      publicEvents={publicEvents}
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={{ currentPage: pageNumber, totalPages }}
      error={error}
      referenceTime={referenceTime}
    />
  )
}
