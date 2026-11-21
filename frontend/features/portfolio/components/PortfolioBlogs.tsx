'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Calendar, Eye, ArrowUpRight, FileText } from 'lucide-react'
import type { MemberPortfolioBlog } from '@/features/users/db/types'

export interface PortfolioBlogsProps {
  blogs?: MemberPortfolioBlog[]
}

function formatDate(date?: Date | null): string {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  } catch {
    return ''
  }
}

export function PortfolioBlogCard({ blog }: { blog: MemberPortfolioBlog }) {
  const defaultBlogImage = '/static/images/social-banner.png'

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-blue-500/30 bg-slate-900/40 shadow-[0_4px_15px_rgba(37,99,235,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/70 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]">
      {/* 1. Thumbnail */}
      <Link
        href={`/blog/${blog.slug || blog.id}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 p-2 sm:p-3"
      >
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {blog.imageUrl ? (
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-950 to-slate-900 text-blue-400">
              <BookOpen className="h-12 w-12 opacity-60" />
            </div>
          )}
        </div>
      </Link>

      {/* 2. Body Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta row: Date & Views */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          {blog.createdAt && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>{formatDate(blog.createdAt)}</span>
            </span>
          )}
          {typeof blog.views === 'number' && (
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-blue-400" />
              <span>{blog.views} lượt xem</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="mt-3 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
          <Link href={`/blog/${blog.slug || blog.id}`} className="line-clamp-2">
            {blog.title}
          </Link>
        </h4>

        {/* Summary */}
        {blog.summary && (
          <p className="mt-2 line-clamp-3 text-justify text-sm leading-relaxed text-slate-300">
            {blog.summary}
          </p>
        )}

        <div className="flex-1" />

        {/* Action Read More */}
        <div className="mt-5 border-t border-slate-800/80 pt-3">
          <Link
            href={`/blog/${blog.slug || blog.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            <span>Đọc bài viết</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioBlogs({ blogs }: PortfolioBlogsProps) {
  return (
    <div className="relative z-10 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          My <span className="text-blue-500">Blogs</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Các bài viết kỹ thuật, chia sẻ kiến thức và nghiên cứu công nghệ
        </p>
      </div>

      {!blogs || blogs.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-blue-500/20 bg-slate-900/50 p-12 text-center text-slate-400">
          <FileText className="mx-auto h-12 w-12 text-slate-500 opacity-60" />
          <p className="mt-4 text-base font-semibold text-slate-300">Chưa có bài viết nào</p>
          <p className="mt-1 text-sm text-slate-500">
            Thành viên này hiện chưa xuất bản bài viết blog nào trên hệ thống.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b, idx) => (
            <PortfolioBlogCard key={`${b.id}-${idx}`} blog={b} />
          ))}
        </div>
      )}
    </div>
  )
}
