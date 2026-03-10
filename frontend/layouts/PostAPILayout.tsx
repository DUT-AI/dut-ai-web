'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ApiBlogDetail, ApiBlog } from 'app/api-client'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { ArrowLeft } from 'lucide-react'

const postDateTemplate: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}

function RelatedBlogCard({ blog }: { blog: ApiBlog }) {
    return (
        <Link
            href={`/blog/${blog.id}`}
            className="flex-shrink-0 w-64 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 ring-1 ring-gray-100 dark:ring-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
            {blog.image_url && (
                <div className="relative w-full h-32 overflow-hidden">
                    <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <div className="p-4">
                <time dateTime={blog.created_at} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    {formatDate(blog.created_at, siteMetadata.locale)}
                </time>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                </h4>
            </div>
        </Link>
    )
}

interface PostAPILayoutProps {
    content: ApiBlogDetail
}

export default function PostAPILayout({ content }: PostAPILayoutProps) {
    const { id, title, created_at, keywords, image_url, views, related_blogs } = content
    // authors may be a string, array, or other shape from the API — normalise to string
    const authorsStr: string = Array.isArray(content.authors)
        ? (content.authors as string[]).join(', ')
        : typeof content.authors === 'string'
            ? content.authors
            : ''
    const authorLabel = authorsStr || 'DUT AI Club'

    const isHtml = !!content.content?.trimStart().startsWith('<')
    const hasContent = !!content.content

    return (
        <SectionContainer>
            <ScrollTopAndComment />
            <article>
                <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
                    {/* Header */}
                    <header className="pt-6 xl:pb-6">
                        <div className="space-y-1 text-center">
                            <dl className="space-y-10">
                                <div>
                                    <dt className="sr-only">Published on</dt>
                                    <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                                        <time dateTime={created_at}>
                                            {new Date(created_at).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                                        </time>
                                    </dd>
                                </div>
                            </dl>
                            <div>
                                <PageTitle>{title}</PageTitle>
                            </div>
                        </div>
                    </header>

                    <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
                        {/* Sidebar: author */}
                        <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                            <dt className="sr-only">Authors</dt>
                            <dd>
                                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                                    <li className="flex items-center space-x-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-blue-500 text-white text-sm font-bold shrink-0">
                                            {authorLabel.charAt(0).toUpperCase()}
                                        </div>
                                        <dl className="whitespace-nowrap text-sm font-medium leading-5">
                                            <dt className="sr-only">Name</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{authorLabel}</dd>
                                            {views !== undefined && (
                                                <dd className="text-xs text-gray-500 dark:text-gray-400">{views.toLocaleString()} lượt xem</dd>
                                            )}
                                        </dl>
                                    </li>
                                </ul>
                            </dd>
                        </dl>

                        {/* Main content */}
                        <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
                            {/* Cover image */}
                            {image_url && (
                                <div className="pt-8 pb-4">
                                    <div className="relative w-full overflow-hidden rounded-2xl aspect-video">
                                        <img src={image_url} alt={title} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* Blog content */}
                            <div className="prose dark:prose-invert max-w-none pt-10 pb-8">
                                {hasContent && (
                                    isHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: content.content }} />
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {content.content}
                                        </ReactMarkdown>
                                    )
                                )}
                            </div>

                            {/* Comments */}
                            {siteMetadata.comments && (
                                <div className="pt-8 pb-6" id="comment">
                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Bình luận</h2>
                                    <div className="rounded-[32px] bg-white dark:bg-[#22272e] p-8 ring-1 ring-gray-100 dark:ring-white/10">
                                        <Comments slug={String(id)} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer sidebar: tags + back link */}
                        <footer>
                            <div className="divide-gray-200 text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                                {keywords && keywords.length > 0 && (
                                    <div className="py-4 xl:py-8">
                                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                                            Tags
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {keywords.map((kw) => (
                                                <Link
                                                    key={kw.id}
                                                    href={`/blog?tag=${encodeURIComponent(kw.keyword_name.toLowerCase())}`}
                                                    className="inline-flex items-center text-xs font-bold rounded-full px-4 py-2 bg-white text-blue-500 ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm transition-all"
                                                >
                                                    <span className="opacity-60 mr-0.5">#</span>
                                                    {kw.keyword_name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 xl:pt-8">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                    aria-label="Back to the blog"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Quay lại Blog
                                </Link>
                            </div>
                        </footer>
                    </div>
                </div>
            </article>

            {/* Related posts */}
            {related_blogs && related_blogs.length > 0 && (
                <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-10">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Bài viết liên quan</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                        {related_blogs.map((blog) => (
                            <div key={blog.id} className="snap-start">
                                <RelatedBlogCard blog={blog} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </SectionContainer>
    )
}
