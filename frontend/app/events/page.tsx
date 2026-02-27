import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import EventsListLayout from '@/layouts/EventsListLayout'
import Footer from '@/components/Footer'

const POSTS_PER_PAGE = 9

export const metadata = genPageMetadata({
    title: 'Sự kiện | DUT AI Club',
    description: 'Tất cả sự kiện, workshop, cuộc thi và hoạt động của DUT AI Club tại Đà Nẵng.',
    keywords: ['sự kiện AI', 'workshop AI Đà Nẵng', 'Welcome Newbie DUT AI', 'hoạt động câu lạc bộ AI', 'cuộc thi AI sinh viên'],
})

export default async function EventsPage() {
    const allPosts = allCoreContent(sortPosts(allBlogs))
    const events = allPosts.filter((post) => post.tags?.includes('event'))
    const totalPages = Math.ceil(events.length / POSTS_PER_PAGE)
    const initialDisplayPosts = events.slice(0, POSTS_PER_PAGE)

    const pagination = {
        currentPage: 1,
        totalPages,
    }

    return (
        <EventsListLayout
            posts={events}
            initialDisplayPosts={initialDisplayPosts}
            pagination={pagination}
        />
    )
}
