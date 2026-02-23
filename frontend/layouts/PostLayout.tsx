import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        {/* Article header */}
        <header className="pt-6 pb-8 text-center border-b border-gray-100 dark:border-gray-800">
          <dl className="mb-4">
            <dt className="sr-only">Published on</dt>
            <dd className="text-sm font-medium text-gray-400 dark:text-gray-500">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
            </dd>
          </dl>
          <PageTitle>{title}</PageTitle>

          {/* Author row */}
          <ul className="mt-6 flex flex-wrap justify-center gap-4">
            {authorDetails.map((author) => (
              <li className="flex items-center gap-2" key={author.name}>
                {author.avatar && (
                  <Image
                    src={author.avatar}
                    width={32}
                    height={32}
                    alt="avatar"
                    className="h-8 w-8 rounded-full ring-2 ring-primary-100 dark:ring-gray-700"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {author.name}
                </span>
                {author.twitter && (
                  <Link
                    href={author.twitter}
                    className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {author.twitter.replace('https://twitter.com/', '@').replace('https://x.com/', '@')}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Tags row */}
          {tags && (
            <div className="mt-4 flex flex-wrap justify-center gap-1">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </header>

        {/*
         * 3-column layout:
         *   col 1 (hidden < xl): empty spacer for symmetry on small screens
         *   col 2: prose content (center, takes most space)
         *   col 3 (hidden < xl): Table of Contents sidebar
         */}
        <div className="xl:grid xl:grid-cols-[1fr_minmax(0,2fr)_280px] xl:gap-x-8 pt-8 pb-12">

          {/* ── Left spacer (xl only) — keeps prose centered ── */}
          <div className="hidden xl:block" />

          {/* ── Prose ── */}
          <div className="min-w-0">
            <div className="prose dark:prose-invert max-w-none pb-8">
              {children}
            </div>

            {/* Discuss + GitHub links */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 pb-4 text-sm text-gray-500 dark:text-gray-400 flex gap-3">
              <Link href={discussUrl(path)} rel="nofollow" className="hover:text-primary-500 transition-colors">
                Thảo luận trên Twitter
              </Link>
              <span aria-hidden>·</span>
              <Link href={editUrl(filePath)} className="hover:text-primary-500 transition-colors">
                Xem trên GitHub
              </Link>
            </div>

            {/* Comments */}
            {siteMetadata.comments && (
              <div className="pt-4 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}

            {/* Prev / Next navigation */}
            {(next || prev) && (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row gap-4">
                {prev?.path && (
                  <div className="flex-1 group">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                      ← Bài trước
                    </p>
                    <Link
                      href={`/${prev.path}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors line-clamp-2"
                    >
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next?.path && (
                  <div className="flex-1 text-right group">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                      Bài sau →
                    </p>
                    <Link
                      href={`/${next.path}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors line-clamp-2"
                    >
                      {next.title}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Back to blog */}
            <div className="pt-6">
              <Link
                href={`/${basePath}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Back to the blog"
              >
                ← Về trang Blog
              </Link>
            </div>
          </div>

          {/* ── TOC Sidebar (Notion-style) ── */}
          <TableOfContents />
        </div>
      </article>
    </SectionContainer>
  )
}
