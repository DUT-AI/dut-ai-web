import { genPageMetadata } from 'app/seo'
import { getPublicEvents, getPosts } from 'app/api-client'
import type { PublicEvent, Post, PastEvent } from 'app/api-client'
import EventsListLayout from '@/layouts/EventsListLayout'

// Safely parse img_urls that backend may return as Python-style string
function parseImgUrls(urls: string[] | string | undefined | null): string[] {
    if (!urls) return []
    if (Array.isArray(urls)) {
        return urls.flatMap((u) => {
            if (typeof u !== 'string') return []
            if (u.startsWith('http')) return [u]
            return (u.match(/https?:\/\/[^'" ,\]]+/g) || [])
        })
    }
    return (urls.match(/https?:\/\/[^'" ,\]]+/g) || [])
}

export const metadata = genPageMetadata({
    title: 'Sự kiện | DUT AI Club',
    description: 'Tất cả sự kiện, workshop, cuộc thi và hoạt động của DUT AI Club tại Đà Nẵng.',
    keywords: ['sự kiện AI', 'workshop AI Đà Nẵng', 'Welcome Newbie DUT AI', 'hoạt động câu lạc bộ AI', 'cuộc thi AI sinh viên'],
})

export const dynamic = 'force-dynamic'

const EVENTS_PER_PAGE = 5

export default async function EventsPage() {
    let publicEvents: PublicEvent[] = []
    let posts: Post[] = []
    let error = false

    try {
        ;[publicEvents, posts] = await Promise.all([getPublicEvents(), getPosts()])
    } catch {
        error = true
    }

    // Prepare unified past events
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
            cover: parseImgUrls(p.img_urls)[0],
            date: p.events_date || p.created_at,
            facebook_url: p.facebook_url,
        })),
    ].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0
        const db = b.date ? new Date(b.date).getTime() : 0
        return db - da
    })

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
        />
    )
}
