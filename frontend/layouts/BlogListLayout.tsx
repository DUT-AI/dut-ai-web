'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { useState, Suspense } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'
import { allAuthors } from 'contentlayer/generated'
import RelatedPosts from '@/components/RelatedPosts'

interface PaginationProps {
    totalPages: number
    currentPage: number
}

interface ListLayoutProps {
    posts: CoreContent<Blog>[]
    title: string
    initialDisplayPosts?: CoreContent<Blog>[]
    pagination?: PaginationProps
}

function PaginationInner({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tagQuery = searchParams.get('tag')
    const tagParam = tagQuery ? `?tag=${tagQuery}` : ''

    const basePath = pathname
        .replace(/^\//, '')
        .replace(/\/page\/\d+\/?$/, '')
        .replace(/\/$/, '')
    const prevPage = currentPage - 1 > 0
    const nextPage = currentPage + 1 <= totalPages

    return (
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <nav className="flex justify-between items-center text-sm font-medium">
                {!prevPage ? (
                    <button className="cursor-auto text-gray-400 disabled:opacity-50 dark:text-gray-500" disabled>
                        Trước
                    </button>
                ) : (
                    <Link
                        href={
                            currentPage - 1 === 1
                                ? `/${basePath}/${tagParam}`
                                : `/${basePath}/page/${currentPage - 1}${tagParam}`
                        }
                        rel="prev"
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Trước
                    </Link>
                )}
                <span className="text-gray-600 dark:text-gray-300">
                    Chỉ mục {currentPage} / {totalPages}
                </span>
                {!nextPage ? (
                    <button className="cursor-auto text-gray-400 disabled:opacity-50 dark:text-gray-500" disabled>
                        Sau
                    </button>
                ) : (
                    <Link
                        href={`/${basePath}/page/${currentPage + 1}${tagParam}`}
                        rel="next"
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Sau
                    </Link>
                )}
            </nav>
        </div>
    )
}

function Pagination(props: PaginationProps) {
    return (
        <Suspense fallback={<div>Loading pagination...</div>}>
            <PaginationInner {...props} />
        </Suspense>
    )
}

// Các màu nền Card lấy cảm hứng từ Figma
const gradients = [
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#22c55e1a] dark:to-[#eab3081a] bg-linear-to-r from-[#EDFCE9] to-[#FEFBE8]', // Green to Yellow
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#64748b1a] dark:to-[#14b8a61a] bg-linear-to-r from-[#EDF5FF] to-[#F1F8FF]', // Slate to Teal
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#f973161a] dark:to-[#ec48991a] bg-linear-to-r from-[#FFF5F5] to-[#FFF0ED]', // Orange to Pink
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#8b5cf61a] dark:to-[#d946ef1a] bg-linear-to-r from-[#F4F2FF] to-[#FCEEFE]', // Purple to Fuchsia
]

function BlogListLayoutInner({
    posts,
    title,
    initialDisplayPosts = [],
    pagination,
}: ListLayoutProps) {
    const [searchValue, setSearchValue] = useState('')
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const activeTagParam = searchParams.get('tag')
    const tagCounts = tagData as Record<string, number>
    const tagKeys = Object.keys(tagCounts)
    const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

    // Lọc bài viết nếu có tham số tag trên URL
    const basePosts = activeTagParam
        ? posts.filter((post) => post.tags?.map((t) => slug(t)).includes(activeTagParam))
        : posts

    // Lấy ra danh sách mặc định tương ứng với biến phân trang (lưu ý: initialDisplayPosts sẽ k đúng nếu dùng query filter nên ta xử lý Client side filter cho query params)
    const queryPaginatedPosts = activeTagParam
        ? basePosts.slice((pagination?.currentPage ? pagination.currentPage - 1 : 0) * 10, (pagination?.currentPage || 1) * 10)
        : initialDisplayPosts

    const filteredBlogPosts = basePosts.filter((post) => {
        const searchContent = post.title + post.summary + post.tags?.join(' ')
        return searchContent.toLowerCase().includes(searchValue.toLowerCase())
    })

    const displayPosts =
        queryPaginatedPosts.length > 0 && !searchValue ? queryPaginatedPosts : filteredBlogPosts

    // Nếu có activeTag, cần tính toán lại Pagination
    const totalPagesForTag = activeTagParam ? Math.ceil(basePosts.length / 10) : pagination?.totalPages
    const adjustedPagination = pagination && totalPagesForTag ? { ...pagination, totalPages: totalPagesForTag } : pagination

    const featuredPosts = posts.slice(0, 5)
    const featuredAuthors = allAuthors.slice(0, 5)


    return (
        <div className="min-h-screen blog-list-page dark:bg-[#0B0F19] pb-12 pt-8 sm:pt-16 relative z-0">
            <style>{`
              .blog-list-page {
                background: #f8fafc;
              }
              .dark .blog-list-page {
                background: #0B0F19;
              }
            `}</style>
            {/* Light-mode decorative blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden dark:hidden">
                <div className="absolute top-[-80px] left-[10%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
                    style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }} />
                <div className="absolute top-[30%] right-[5%] h-[320px] w-[320px] rounded-full opacity-30 blur-[80px]"
                    style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }} />
                <div className="absolute bottom-[10%] left-[20%] h-[260px] w-[260px] rounded-full opacity-25 blur-[70px]"
                    style={{ background: 'radial-gradient(circle, #bae6fd 0%, transparent 70%)' }} />
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 mt-28">
                    <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100 uppercase mb-4">
                        AI KNOWLEDGE HUB
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Khám phá kho tàng kiến thức công nghệ, nghiên cứu AI và các xu hướng lập trình mới nhất được tổng hợp bởi DUT AI Club.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    {/* Sidebar */}
                    <div className="w-full lg:w-[300px] xl:w-[320px] mb-10 lg:mb-0 shrink-0">
                        {/* Sticky Container */}
                        <div className="lg:sticky lg:top-24 space-y-8">
                            {/* Search Box */}
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Search className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full py-3.5 pl-11 pr-4 text-sm text-gray-900 border-none rounded-2xl bg-white shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:bg-gray-900 dark:ring-gray-800 dark:text-white transition-all placeholder:text-gray-400"
                                        placeholder="Tìm kiếm..."
                                        aria-label="Tìm kiếm bài viết"
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mb-5 pl-1">
                                    DANH MỤC
                                </h3>

                                {/* All Posts Button */}
                                {!activeTagParam && (pathname === '/blog' || pathname.startsWith('/blog/page')) ? (
                                    <div className="w-full bg-[#FF8A00] hover:bg-[#E67E00] text-white font-bold py-3.5 px-4 rounded-xl mb-6 transition-all text-center cursor-default shadow-lg shadow-orange-500/25">
                                        TẤT CẢ TÀI LIỆU
                                    </div>
                                ) : (
                                    <Link
                                        href="/blog"
                                        className="block w-full bg-[#FF8A00] hover:bg-[#E67E00] text-white font-bold py-3.5 px-4 rounded-xl mb-6 transition-all text-center shadow-lg shadow-orange-500/25"
                                    >
                                        TẤT CẢ TÀI LIỆU
                                    </Link>
                                )}

                                {/* Tag Pills */}
                                <div className="flex flex-col space-y-2">
                                    {sortedTags.map((t) => {
                                        const tagSlug = slug(t)
                                        const isActive = activeTagParam === tagSlug

                                        return (
                                            <Link
                                                key={t}
                                                href={`/blog?tag=${tagSlug}`}
                                                className={`text-[13px] font-bold rounded-full px-5 py-2.5 transition-all w-fit inline-flex items-center ${isActive
                                                    ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800'
                                                    : 'bg-white text-blue-500 ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:ring-gray-200 shadow-sm'
                                                    }`}
                                            >
                                                <span className="opacity-60 mr-0.5">#</span>
                                                {t}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Featured Authors */}
                            <div className="pt-10">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mb-5 pl-1">
                                    TÁC GIẢ NỔI BẬT
                                </h3>
                                <div className="flex flex-col space-y-4">
                                    {featuredAuthors.map(author => (
                                        <div key={author.name} className="flex items-center gap-3 bg-white dark:bg-gray-900/50 p-3 rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 hover:ring-blue-100 dark:hover:ring-gray-700 transition-all">
                                            {author.avatar && (
                                                <Image src={author.avatar} width={40} height={40} className="rounded-full w-10 h-10 object-cover" alt={author.name} />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[14px] text-gray-900 dark:text-white truncate">{author.name}</h4>
                                                <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">{author.occupation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 w-full min-w-0">

                        {/* Featured Posts Carousel */}
                        {!activeTagParam && !searchValue && (!pagination || pagination.currentPage === 1) && featuredPosts.length > 0 && (
                            <div className="mb-16 -mx-4 sm:mx-0">
                                <div className="px-4 sm:px-0 mb-6">
                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Bài viết nổi bật</h2>
                                </div>
                                <div className="relative">
                                    <RelatedPosts posts={featuredPosts} hideTitle />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Danh sách bài viết</h2>
                        </div>

                        {!filteredBlogPosts.length && (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[32px] ring-1 ring-gray-100 dark:ring-gray-800">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy bài viết nào phù hợp.</p>
                            </div>
                        )}

                        <div className="flex flex-col space-y-6">
                            {displayPosts.map((post, index) => {
                                const { path, date, title, summary, tags } = post
                                const backgroundClass = gradients[index % gradients.length]
                                const maxTagsDisplay = tags ? tags.slice(0, 1) : [] // Hiển thị 1 tag nổi bật để giống ảnh

                                return (
                                    <article
                                        key={path}
                                        className={`rounded-[32px] p-8 sm:p-10 ${backgroundClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group`}
                                    >
                                        <div className="flex flex-col h-full relative z-10">

                                            {/* Top Row: Date & Tag */}
                                            <div className="flex flex-wrap items-center gap-4 mb-5">
                                                <time dateTime={date} className="text-sm font-bold tracking-wide text-gray-500/80 dark:text-gray-400">
                                                    {formatDate(date, siteMetadata.locale)}
                                                </time>
                                                {maxTagsDisplay.map((tag) => (
                                                    <Link key={tag} href={`/blog?tag=${slug(tag)}`} className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/60 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                                        <span className="opacity-60 mr-0.5">#</span>{tag}
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Title & Summary */}
                                            <div className="mb-8">
                                                <h2 className="text-[26px] md:text-[28px] leading-tight font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    <Link href={`/${path}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
                                                        <span className="absolute inset-0 z-0" aria-hidden="true" />
                                                        {title}
                                                    </Link>
                                                </h2>

                                                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl line-clamp-2">
                                                    {summary}
                                                </p>
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-auto">
                                                <span className="inline-flex items-center text-[15px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                                    Đọc chi tiết bài viết
                                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        {/* Pagination Box */}
                        {adjustedPagination && adjustedPagination.totalPages > 1 && !searchValue && (
                            <div className="mt-10 mb-8 border-t border-gray-200 dark:border-gray-800">
                                <Pagination currentPage={adjustedPagination.currentPage} totalPages={adjustedPagination.totalPages} />
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default function BlogListLayout(props: ListLayoutProps) {
    return (
        <Suspense fallback={<div className="min-h-screen blog-list-page dark:bg-gray-950 pb-12 pt-8 sm:pt-16 flex items-center justify-center"><p>Đang tải dữ liệu...</p></div>}>
            <BlogListLayoutInner {...props} />
        </Suspense>
    )
}
