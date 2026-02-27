import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'
import { slug } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import Footer from '@/components/Footer'

const gradients = [
  'bg-linear-to-r from-[#F4F2FF] to-[#FCEEFE] dark:from-purple-900/10 dark:to-pink-900/10',
  'bg-linear-to-r from-[#EDFCE9] to-[#FEFBE8] dark:from-lime-900/10 dark:to-yellow-900/10',
  'bg-linear-to-r from-[#EDF5FF] to-[#F1F8FF] dark:from-blue-900/10 dark:to-sky-900/10',
  'bg-linear-to-r from-[#FFF5F5] to-[#FFF0ED] dark:from-red-900/10 dark:to-orange-900/10',
]

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, children }: LayoutProps) {
  const { slug: postSlug, date, lastmod, title, tags } = content
  const basePath = 'blog'

  const relatedPosts = sortPosts(allBlogs).filter(p => p.slug !== postSlug).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-[#E6EFFF] via-[#F4F1FF] to-[#FFEBEA] dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1 pb-12 pt-8 sm:pt-16">
        <ScrollTopAndComment />
        <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Cấu trúc Header Mới ── */}
          <header className="mb-12">
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-[#111827] sm:text-5xl md:text-[56px] dark:text-gray-100 mb-8 max-w-5xl">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-6 gap-x-10">

              {/* Tác giả */}
              {authorDetails.map((author) => (
                <div className="flex items-center gap-3" key={author.name}>
                  {author.avatar ? (
                    <div className="p-1 rounded-full border border-gray-200 shadow-sm bg-white">
                      <Image
                        src={author.avatar}
                        width={36}
                        height={36}
                        alt="avatar"
                        className="h-9 w-9 rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex bg-white items-center justify-center w-11 h-11 rounded-full border border-gray-200">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <span className="block text-[11px] text-gray-500 font-bold mb-0.5 tracking-wider uppercase">Tác giả</span>
                    <span className="text-[15px] text-gray-900 dark:text-white font-extrabold">{author.name}</span>
                  </div>
                </div>
              ))}

              {/* Ngày đăng */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-white w-11 h-11 rounded-full border border-gray-200 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500 font-bold mb-0.5 tracking-wider uppercase">Ngày đăng</span>
                  <time dateTime={date} className="text-[15px] text-gray-900 dark:text-white font-extrabold">{new Date(date).toLocaleDateString('en-GB')}</time>
                </div>
              </div>

              {/* Ngày cập nhật */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-white w-11 h-11 rounded-full border border-gray-200 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500 font-bold mb-0.5 tracking-wider uppercase">Ngày cập nhật</span>
                  <time dateTime={lastmod || date} className="text-[15px] text-gray-900 dark:text-white font-extrabold">{new Date(lastmod || date).toLocaleDateString('en-GB')}</time>
                </div>
              </div>

              {/* Lượt xem (Mock static tạm thời hoặc tính năng tương lai) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-white w-11 h-11 rounded-full border border-gray-200 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500 font-bold mb-0.5 tracking-wider uppercase">Lượt xem</span>
                  <span className="text-[15px] text-gray-900 dark:text-white font-extrabold">120.000</span>
                </div>
              </div>

              {/* Group Actions */}
              <div className="flex items-center gap-2 ml-auto">
                <button className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors w-11 h-11 rounded-full border border-gray-200 shadow-sm" aria-label="Share">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
                <button className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors w-11 h-11 rounded-full border border-gray-200 shadow-sm" aria-label="Save">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* ── Cấu trúc Grid Layout (TOC + Prose) ── */}
          <div className="flex flex-col lg:flex-row lg:space-x-12">

            {/* Cột Trái: Table of Contents */}
            <TableOfContents />

            {/* Cột Phải: Nội dung bài viết */}
            <div className="flex-1 w-full min-w-0">
              {/* Tags Pill */}
              {tags && (
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${slug(tag)}`} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide shadow-sm hover:ring-1 hover:ring-gray-200 transition-all">
                      <span className="opacity-60 mr-1">#</span>{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Article Main card */}
              <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  {children}
                </div>

                {/* Back to blog */}
                <div className="pt-12 mt-12 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href={`/${basePath}`}
                    className="inline-flex items-center gap-2 text-[15px] font-bold uppercase tracking-widest text-[#FF8A00] hover:text-[#E67E00] transition-colors"
                    aria-label="Back to the blog"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Về trang Blog
                  </Link>
                </div>

                {/* Comments component */}
                {siteMetadata.comments && (
                  <div className="pt-10 pb-6 mt-8 border-t border-gray-100 dark:border-gray-800" id="comment">
                    <Comments slug={postSlug} />
                  </div>
                )}

              </div>
            </div>

          </div>
        </article>

        {/* Bài viết liên quan */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 mb-12 w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Bài viết liên quan</h2>
              <div className="flex gap-2">
                <button className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors w-10 h-10 rounded-full border border-gray-200 shadow-sm" aria-label="Previous">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors w-10 h-10 rounded-full border border-gray-200 shadow-sm" aria-label="Next">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => {
                const backgroundClass = gradients[index % gradients.length]
                const maxTagsDisplay = post.tags ? post.tags.slice(0, 1) : []

                return (
                  <article
                    key={post.path}
                    className={`rounded-[32px] p-8 ${backgroundClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group flex flex-col h-full ring-1 ring-gray-100 dark:ring-white/10`}
                  >
                    <div className="flex flex-col h-full relative z-10">
                      {/* Top Row: Date & Tag */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <time dateTime={post.date} className="text-xs font-bold tracking-wide text-gray-500/80 dark:text-gray-400">
                          {formatDate(post.date, siteMetadata.locale)}
                        </time>
                        {maxTagsDisplay.map((tag) => (
                          <Link key={tag} href={`/blog?tag=${slug(tag)}`} className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/60 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
                            <span className="opacity-60 mr-0.5">#</span>{tag}
                          </Link>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-[20px] leading-snug font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                        <Link href={`/${post.path}`} className="focus:outline-none rounded-lg">
                          <span className="absolute inset-0 z-0" aria-hidden="true" />
                          {post.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mt-auto">
                        {post.summary}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
