import { getPublicEvents, getPosts } from 'app/api-client'
import type { PublicEvent, Post, PastEvent } from 'app/api-client'
import EventsListLayout from '@/layouts/EventsListLayout'
import { genPageMetadata } from 'app/seo'

const EVENTS_PER_PAGE = 5

export const generateMetadata = async ({ params }: { params: Promise<{ page: string }> }) => {
    const { page } = await params
    return genPageMetadata({
        title: `Events — Trang ${page}`,
        description: 'Tất cả sự kiện của DUT AI Club',
    })
}

// Since we're fetching from a dynamic API now, we should probably mark this as dynamic
// or use revalidate if we want static export. For now, matching the main events page.
export const dynamic = 'force-dynamic'

export default async function EventsPage({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params
    const pageNumber = parseInt(page)

    let publicEvents: PublicEvent[] = []
    let posts: Post[] = []
    let error = false

    try {
        ;[publicEvents, posts] = await Promise.all([getPublicEvents(), getPosts()])
    } catch {
        error = true
    }

    // Merge and sort all past events
    const allPastEvents: PastEvent[] = [
        ...publicEvents.map((ev) => ({
            id: `pe-${ev.id}`,
            type: 'public_event' as const,
            title: ev.title,
            summary: ev.summary || ev.description,
            cover: ev.img_url,
            date: ev.events_date || ev.created_at,
            facebook_url: ev.facebook_url,
        })),
        ...posts.map((p) => ({
            id: `post-${p.id}`,
            type: 'post' as const,
            title: p.title,
            summary: p.summary || p.description,
            cover: p.img_urls?.[0],
            date: p.events_date || p.created_at,
            facebook_url: p.facebook_url,
        })),
    ].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0
        const db = b.date ? new Date(b.date).getTime() : 0
        return db - da
    })

    const totalPages = Math.ceil(allPastEvents.length / EVENTS_PER_PAGE)
    const initialDisplayPosts = allPastEvents.slice(EVENTS_PER_PAGE * (pageNumber - 1), EVENTS_PER_PAGE * pageNumber)
    const pagination = { currentPage: pageNumber, totalPages }

    return (
        <EventsListLayout
            publicEvents={publicEvents}
            posts={posts}
            initialDisplayPosts={initialDisplayPosts}
            pagination={pagination}
            error={error}
        />
    )
}
