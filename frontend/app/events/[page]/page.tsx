import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import EventsListLayout from '@/layouts/EventsListLayout'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 9

export const generateMetadata = async ({ params }: { params: Promise<{ page: string }> }) => {
    const { page } = await params
    return genPageMetadata({
        title: `Events — Trang ${page}`,
        description: 'Tất cả sự kiện của DUT AI Club',
    })
}

export const generateStaticParams = async () => {
    const allPosts = allCoreContent(sortPosts(allBlogs))
    const events = allPosts.filter((post) => post.tags?.includes('event'))
    const totalPages = Math.ceil(events.length / POSTS_PER_PAGE)
    return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }))
}

export default async function EventsPage({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params
    const allPosts = allCoreContent(sortPosts(allBlogs))
    const events = allPosts.filter((post) => post.tags?.includes('event'))
    const pageNumber = parseInt(page)
    const totalPages = Math.ceil(events.length / POSTS_PER_PAGE)
    const initialDisplayPosts = events.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
    const pagination = { currentPage: pageNumber, totalPages }

    return (
        <EventsListLayout
            posts={events}
            initialDisplayPosts={initialDisplayPosts}
            pagination={pagination}
        />
    )
}
