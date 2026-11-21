'use client'

import { ReactNode, useEffect, useState } from 'react'
import Comments from '@/features/blog/components/Comments'
import Link from '@/components/common/Link'
import Image from '@/components/common/Image'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/common/ScrollTopAndComment'
import TableOfContents from '@/features/blog/components/TableOfContents'
import Footer from '@/components/layout/Footer'
import RelatedPosts from '@/features/blog/components/RelatedPosts'
import SocialShare from '@/components/common/SocialShare'
import type { Blog } from 'app/api-client'
import { slug } from 'github-slugger'

interface LayoutProps {
  post: Blog & { related_blogs?: Blog[] }
  children: ReactNode
}

export default function PostLayoutAPI({ post, children }: LayoutProps) {
  const {
    title,
    created_at,
    updated_at,
    keywords,
    authors,
    slug: postSlug,
    views,
    related_blogs,
  } = post
  const basePath = 'blog'
  const relatedPosts = related_blogs || []

  const [viewCount, setViewCount] = useState<number>(views || 0)

  // Cập nhật lượt xem không gây delay (Non-blocking async sync + Optimistic update)
  useEffect(() => {
    if (!post?.id) return

    const sessionKey = `viewed_blog_${post.id}`
    // Đảm bảo mỗi phiên đọc chỉ ghi nhận 1 lần để tránh spam F5
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(sessionKey)) {
      return
    }

    try {
      window.sessionStorage.setItem(sessionKey, '1')
    } catch {
      // Safari Private Mode hoặc storage bị chặn
    }

    // 1. Tăng lượt xem lạc quan ngay tức thì trên giao diện (defer ngoài synchronous effect pass)
    queueMicrotask(() => {
      setViewCount((prev) => prev + 1)
    })

    // 2. Gửi request ngầm xuống Database không làm chậm tốc độ tải trang
    fetch('/api/blogs/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id }),
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.views !== undefined && typeof data.views === 'number') {
          setViewCount(data.views)
        }
      })
      .catch(() => {
        // Thao tác ngầm thất bại không làm ảnh hưởng đến trải nghiệm đọc bài
      })
  }, [post?.id])

  return (
    <div className="relative z-0 flex min-h-screen flex-col bg-[#FDFBFB] dark:bg-gray-950">
      {/* Gradient Blob for Header Area */}
      <div className="absolute top-0 right-0 left-0 -z-10 h-[800px] bg-linear-to-br from-[#E6EFFF] via-[#F4F1FF] to-[#FFEBEA] mask-[linear-gradient(to_bottom,white_20%,transparent)] dark:from-purple-900/20 dark:via-gray-950 dark:to-gray-950" />

      <div className="flex-1 pt-4 pb-12 sm:pt-16">
        <ScrollTopAndComment />
        <article className="mx-auto max-w-[1536px] px-0 sm:px-6 lg:px-8 xl:px-12">
          {/* ── Header bài viết ── */}
          <header className="mt-20 mb-10 px-4 sm:mt-28 sm:mb-14 sm:px-0">
            {/* 1. Category / Keywords Pills (Giữ nguyên như đã thống nhất) */}
            {keywords && keywords.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
                {keywords.map((kw) => (
                  <Link
                    key={kw.id}
                    href={`/blog?tag=${slug(kw.keyword_name)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/60"
                  >
                    <span className="font-bold text-blue-400 dark:text-blue-500">#</span>
                    {kw.keyword_name}
                  </Link>
                ))}
              </div>
            )}

            {/* 2. Tiêu đề bài viết */}
            <h1 className="mb-6 max-w-5xl text-2xl leading-[1.25] font-extrabold tracking-tight text-gray-900 sm:mb-8 sm:text-3xl md:mb-10 md:text-4xl lg:text-5xl dark:text-white">
              {title}
            </h1>

            {/* 3. Dãy Metadata chuẩn mực, chia layout thông minh trên mobile & desktop */}
            <div className="flex flex-col gap-y-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-5 md:gap-x-10">
              {/* Cụm Tác giả (gom nhóm riêng biệt để không bị xen kẽ ngày tháng trên mobile) */}
              {authors && authors.length > 0 && (
                <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3.5 sm:gap-x-8">
                  {authors.map((author) => (
                    <div className="flex shrink-0 items-center gap-3" key={author.id}>
                      {author.avatar_url ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200/80 bg-white shadow-xs sm:h-11 sm:w-11 dark:border-gray-700 dark:bg-gray-800">
                          <Image
                            src={author.avatar_url}
                            width={44}
                            height={44}
                            alt={author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white text-sm font-bold text-blue-600 shadow-xs sm:h-11 sm:w-11 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400">
                          {author.name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <div>
                        <span className="mb-1 block text-[11px] leading-none font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                          Tác giả
                        </span>
                        <span className="text-sm leading-tight font-extrabold text-gray-900 sm:text-[15px] dark:text-white">
                          {author.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Phân cách mảnh tinh tế chỉ trên mobile */}
              {authors && authors.length > 0 && (
                <div className="my-0.5 h-px w-full bg-gray-200/60 sm:hidden dark:bg-gray-800/80" />
              )}

              {/* Cụm Ngày đăng, Ngày cập nhật, Lượt xem, Chia sẻ: Lưới 2 cột đều chằn chặn trên mobile */}
              <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8 md:gap-x-10">
                {/* Ngày đăng */}
                <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-400 shadow-xs sm:h-11 sm:w-11 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[11px] leading-none font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Ngày đăng
                    </span>
                    <time
                      dateTime={created_at}
                      className="block truncate text-sm leading-tight font-extrabold text-gray-900 sm:text-[15px] dark:text-white"
                    >
                      {new Date(created_at).toLocaleDateString('en-GB')}
                    </time>
                  </div>
                </div>

                {/* Ngày cập nhật */}
                <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-400 shadow-xs sm:h-11 sm:w-11 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[11px] leading-none font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Ngày cập nhật
                    </span>
                    <time
                      dateTime={updated_at || created_at}
                      className="block truncate text-sm leading-tight font-extrabold text-gray-900 sm:text-[15px] dark:text-white"
                    >
                      {new Date(updated_at || created_at).toLocaleDateString('en-GB')}
                    </time>
                  </div>
                </div>

                {/* Lượt xem */}
                <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-400 shadow-xs sm:h-11 sm:w-11 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[11px] leading-none font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Lượt xem
                    </span>
                    <span className="block text-sm leading-tight font-extrabold text-gray-900 sm:text-[15px] dark:text-white">
                      {viewCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Nút Copy Link / Share */}
                <div className="flex shrink-0 items-center sm:ml-auto">
                  <SocialShare url={`${siteMetadata.siteUrl}/blog/${postSlug}`} showMobileLabel />
                </div>
              </div>
            </div>
          </header>

          {/* ── Cấu trúc Grid Layout (TOC + Prose) ── */}
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            {/* Cột Trái: Table of Contents */}
            <TableOfContents />

            {/* Cột Phải: Nội dung bài viết */}
            <div className="w-full min-w-0 flex-1">
              {/* Article Main card */}
              <div className="rounded-none border-y border-gray-100 bg-white px-4 py-8 shadow-none ring-0 sm:rounded-[32px] sm:border-y-0 sm:p-8 sm:shadow-sm sm:ring-1 sm:ring-gray-100 md:p-12 lg:p-16 dark:border-gray-800 dark:bg-gray-900 dark:sm:ring-gray-800">
                <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  {children}
                </div>

                {/* Back to blog */}
                <div className="mt-12 border-t border-gray-100 pt-12 dark:border-gray-800">
                  <Link
                    href={`/${basePath}`}
                    className="inline-flex items-center gap-2 text-[15px] font-bold tracking-widest text-[#FF8A00] uppercase transition-colors hover:text-[#E67E00]"
                    aria-label="Back to the blog"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Về trang Blog
                  </Link>
                </div>

                {/* Comments component */}
                {siteMetadata.comments?.provider && (
                  <div
                    className="mt-8 border-t border-gray-100 pt-10 pb-6 dark:border-gray-800"
                    id="comment"
                  >
                    <Comments slug={postSlug || String(post.id)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Bài viết liên quan */}
        <div className="mx-auto mt-24 mb-12 w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <RelatedPosts posts={relatedPosts} hideTitle={true} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
