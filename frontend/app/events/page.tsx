import { genPageMetadata } from 'app/seo'
import { getPublicEventsCached as getPublicEvents, getPostsCached as getPosts } from '@/lib/db/cached-queries'
import type { PublicEvent, Post } from '@/lib/db/features/events/types'
import { buildPastEvents } from '@/lib/db/features/events/timeline'
import EventsListLayout from '@/layouts/EventsListLayout'

export const metadata = genPageMetadata({
    title: 'Sự kiện | DUT AI Club',
    description: 'Tất cả sự kiện, workshop, cuộc thi và hoạt động của DUT AI Club tại Đà Nẵng.',
    keywords: ['sự kiện AI', 'workshop AI Đà Nẵng', 'Welcome Newbie DUT AI', 'hoạt động câu lạc bộ AI', 'cuộc thi AI sinh viên'],
})

export const dynamic = 'force-dynamic'

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
