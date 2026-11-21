'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/common/Link'
import Tag from '@/features/blog/components/Tag'
import Image from '@/components/common/Image'
import siteMetadata from '@/data/siteMetadata'
import { useState, Suspense, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import { getBlogs } from 'app/api-client'
import type { Blog, BlogKeyword, AuthorStats } from 'app/api-client'
import RelatedPosts from '@/features/blog/components/RelatedPosts'
import { getBlogThumbnailPath } from '@/lib/blog-thumbnail-url'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: Blog[]
  initialDisplayPosts?: Blog[]
  pagination?: PaginationProps
  featuredPosts?: Blog[]
  featuredAuthors?: AuthorStats[]
  tags?: BlogKeyword[]
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
      <nav className="flex items-center justify-between text-sm font-medium">
        {!prevPage ? (
          <button
            className="cursor-auto text-gray-400 disabled:opacity-50 dark:text-gray-500"
            disabled
          >
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
          <button
            className="cursor-auto text-gray-400 disabled:opacity-50 dark:text-gray-500"
            disabled
          >
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
  initialDisplayPosts = [],
  pagination,
  featuredPosts = [],
  featuredAuthors = [],
  tags = [],
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const [apiSearchResults, setApiSearchResults] = useState<Blog[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTagParam = searchParams.get('tag')
  const sortedTags = tags.sort((a, b) => b.number_blog_contain - a.number_blog_contain)

  // Gọi API tìm kiếm thay vì filter cứng ở client
  useEffect(() => {
    if (!searchValue.trim() && !activeTagParam) {
      const resetTimer = setTimeout(() => {
        setApiSearchResults(null)
        setIsSearching(false)
      }, 0)
      return () => clearTimeout(resetTimer)
    }

    const delayDebounceFn = setTimeout(
      async () => {
        setIsSearching(true)
        try {
          // Call the API with the search value and keyword
          const params: any = {}
          if (searchValue.trim()) params.title = searchValue
          if (activeTagParam) params.keyword = activeTagParam

          const results = await getBlogs(params)
          setApiSearchResults(results)
        } catch (error) {
          console.error('Failed to fetch search results:', error)
          setApiSearchResults([])
        } finally {
          setIsSearching(false)
        }
      },
      searchValue.trim() ? 300 : 0
    ) // No delay needed if only switching tags

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue, activeTagParam])

  // Nếu đang tìm kiếm hoặc lọc qua tag, ta sẽ dùng list trả về từ API. Ngược lại dùng list mặc định truyền từ server
  const basePosts = searchValue || activeTagParam ? apiSearchResults || [] : posts

  // Pagination logic: Nếu có search chữ thì show hết không phân trang, nếu chỉ có tag (hoặc không gì cả) thì phân trang list đang có
  const queryPaginatedPosts =
    activeTagParam && !searchValue
      ? basePosts.slice(
          (pagination?.currentPage ? pagination.currentPage - 1 : 0) * 10,
          (pagination?.currentPage || 1) * 10
        )
      : initialDisplayPosts

  const displayPosts = searchValue
    ? basePosts // Show all search results without pagination
    : queryPaginatedPosts

  // Nếu có activeTag, cần tính toán lại Pagination
  const totalPagesForTag = activeTagParam
    ? Math.ceil(basePosts.length / 10)
    : pagination?.totalPages
  const adjustedPagination =
    pagination && totalPagesForTag ? { ...pagination, totalPages: totalPagesForTag } : pagination

  const formatViews = (n: number): string => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
  }

  return (
    <div className="blog-list-page relative z-0 min-h-screen pt-8 pb-12 sm:pt-16 dark:bg-[#0B0F19]">
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
        <div
          className="absolute top-[-80px] left-[10%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[30%] right-[5%] h-[320px] w-[320px] rounded-full opacity-30 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] h-[260px] w-[260px] rounded-full opacity-25 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #bae6fd 0%, transparent 70%)' }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto mt-28 mb-16 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 uppercase sm:text-5xl md:text-6xl dark:text-gray-100">
            AI KNOWLEDGE HUB
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Khám phá kho tàng kiến thức công nghệ, nghiên cứu AI và các xu hướng lập trình mới nhất
            được tổng hợp bởi DUT AI Club.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Sidebar */}
          <div className="mb-10 w-full shrink-0 lg:mb-0 lg:w-[300px] xl:w-[320px]">
            {/* Sticky Container */}
            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Search Box */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-primary-500 block w-full rounded-2xl border-none bg-white py-3.5 pr-4 pl-11 text-sm text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset dark:bg-gray-900 dark:text-white dark:ring-gray-800"
                    placeholder="Tìm kiếm..."
                    aria-label="Tìm kiếm bài viết"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-5 pl-1 text-xs font-bold tracking-[0.15em] text-gray-500 uppercase dark:text-gray-400">
                  DANH MỤC
                </h3>

                {/* All Posts Button */}
                {!activeTagParam && (pathname === '/blog' || pathname.startsWith('/blog/page')) ? (
                  <div className="mb-6 w-full cursor-default rounded-xl bg-[#FF8A00] px-4 py-3.5 text-center font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-[#E67E00]">
                    TẤT CẢ TÀI LIỆU
                  </div>
                ) : (
                  <Link
                    href="/blog"
                    className="mb-6 block w-full rounded-xl bg-[#FF8A00] px-4 py-3.5 text-center font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-[#E67E00]"
                  >
                    TẤT CẢ TÀI LIỆU
                  </Link>
                )}

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2">
                  {sortedTags.map((t) => {
                    const isActive = activeTagParam === t.keyword_name

                    return (
                      <Link
                        key={t.id}
                        href={`/blog?tag=${t.keyword_name}`}
                        className={`inline-flex w-fit items-center rounded-full px-5 py-2.5 text-[13px] font-bold transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800'
                            : 'dark:text-primary-400 bg-white text-blue-500 shadow-sm ring-1 ring-gray-100 hover:bg-gray-50 hover:ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <span className="mr-0.5 opacity-60">#</span>
                        {t.keyword_name + ` (${t.number_blog_contain})`}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Featured Authors */}
              <div className="pt-10">
                <h3 className="mb-5 pl-1 text-xs font-bold tracking-[0.15em] text-gray-500 uppercase dark:text-gray-400">
                  TÁC GIẢ NỔI BẬT
                </h3>
                <div className="flex flex-col space-y-4">
                  {featuredAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition-all hover:ring-blue-100 dark:bg-gray-900/50 dark:ring-gray-800 dark:hover:ring-gray-700"
                    >
                      {author.avatar_url && (
                        <Image
                          src={author.avatar_url}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          alt={author.name}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-[14px] font-bold text-gray-900 dark:text-white">
                          {author.name}
                        </h4>
                        <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                          {author.post_count ?? 0} bài · {formatViews(author.total_views ?? 0)} lượt
                          xem
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="w-full min-w-0 flex-1">
            {/* Featured Posts Carousel */}
            {!activeTagParam &&
              !searchValue &&
              (!pagination || pagination.currentPage === 1) &&
              featuredPosts.length > 0 && (
                <div className="-mx-4 mb-16 sm:mx-0">
                  <div className="mb-6 px-4 sm:px-0">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      Bài viết nổi bật
                    </h2>
                  </div>
                  <div className="relative">
                    <RelatedPosts posts={featuredPosts} hideTitle />
                  </div>
                </div>
              )}

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {searchValue ? `Kết quả tìm kiếm cho "${searchValue}"` : 'Danh sách bài viết'}
              </h2>
              {isSearching && (
                <div className="text-sm text-gray-500 dark:text-gray-400">Đang tìm kiếm...</div>
              )}
            </div>

            {!isSearching && displayPosts.length === 0 && (
              <div className="rounded-[32px] bg-white py-20 text-center ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Không tìm thấy bài viết nào phù hợp.
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-6">
              {displayPosts.map((post, index) => {
                const path = `blog/${post.slug || post.id}`
                const date = post.created_at
                const title = post.title
                const summary = post.summary
                const tags = post.keywords?.map((k) => k.keyword_name) || []
                const backgroundClass = gradients[index % gradients.length]
                const maxTagsDisplay = tags

                return (
                  <article
                    key={path}
                    className={`rounded-[32px] p-8 sm:p-10 ${backgroundClass} group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="relative mb-6 aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/40">
                        <Image
                          src={post.image_url || getBlogThumbnailPath(post.slug || post.id)}
                          alt={`Ảnh bìa ${title}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 700px"
                        />
                      </div>

                      {/* Top Row: Date & Tag */}
                      <div className="mb-5 flex flex-wrap items-center gap-4">
                        <time
                          dateTime={date}
                          className="text-sm font-bold tracking-wide text-gray-500/80 dark:text-gray-400"
                        >
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                        {maxTagsDisplay.map((tag) => (
                          <Link
                            key={tag}
                            href={`/blog?tag=${slug(tag)}`}
                            className="rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-900/60 dark:text-blue-400 dark:hover:bg-gray-800"
                          >
                            <span className="mr-0.5 opacity-60">#</span>
                            {tag}
                          </Link>
                        ))}
                      </div>

                      {/* Title & Summary */}
                      <div className="mb-8">
                        <h2 className="mb-3 text-[26px] leading-tight font-extrabold text-gray-900 transition-colors group-hover:text-blue-600 md:text-[28px] dark:text-white dark:group-hover:text-blue-400">
                          <Link
                            href={`/${path}`}
                            className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            <span className="absolute inset-0 z-0" aria-hidden="true" />
                            {title}
                          </Link>
                        </h2>

                        <p className="line-clamp-2 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
                          {summary}
                        </p>
                      </div>

                      {/* Authors display */}
                      {post.authors && post.authors.length > 0 && (
                        <div className="mb-4 flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            {post.authors.map((author) =>
                              author.avatar_url ? (
                                <Image
                                  key={author.id}
                                  src={author.avatar_url}
                                  alt={author.name}
                                  width={28}
                                  height={28}
                                  className="inline-block h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                                />
                              ) : (
                                <div
                                  key={author.id}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 ring-2 ring-white dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-900"
                                >
                                  {author.name?.charAt(0) || 'A'}
                                </div>
                              )
                            )}
                          </div>
                          <span className="max-w-xs truncate text-xs font-medium text-gray-600 dark:text-gray-400">
                            {post.authors.map((a) => a.name).join(', ')}
                          </span>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-auto">
                        <span className="inline-flex items-center text-[15px] font-bold text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400">
                          Đọc chi tiết bài viết
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
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
                <Pagination
                  currentPage={adjustedPagination.currentPage}
                  totalPages={adjustedPagination.totalPages}
                />
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
    <Suspense
      fallback={
        <div className="blog-list-page flex min-h-screen items-center justify-center pt-8 pb-12 sm:pt-16 dark:bg-gray-950">
          <p>Đang tải dữ liệu...</p>
        </div>
      }
    >
      <BlogListLayoutInner {...props} />
    </Suspense>
  )
}
