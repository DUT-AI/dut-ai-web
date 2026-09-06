import Image from 'next/image'
import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'
import ButtonLink from '@/components/ButtonLink'
import type { Blog } from 'app/api-client'
import Heading from './Heading'
import { getBlogThumbnailPath } from '@/lib/blog-thumbnail-url'

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogSection({ blogs }: { blogs: Blog[] }) {
    if (!blogs || blogs.length === 0) return null

    const featured = blogs[0]
    const rest = blogs.slice(1, 4)

    return (
        <section className="relative px-6 md:px-12 flex justify-center">
            <div className="w-full max-w-6xl relative z-10">
                {/* Header */}
                <Heading heading="AI KNOWLEDGE" subHeading="FROM OUR BLOG" description="Khám phá kho tàng kiến thức công nghệ, nghiên cứu AI và các xu hướng lập trình mới nhất được tổng hợp bởi DUT AI Club." badge="BLOGS" isSubHeadingEnter={true} />


                {/* Magazine Layout: Featured left + Side cards right */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Featured Card — spans 3 cols */}
                    <Link
                        href={`/blog/${featured.slug || featured.id}`}
                        className="lg:col-span-3 group relative rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800/80 border border-white dark:border-gray-700/50 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1"
                    >
                        {/* Image */}
                        <div className="relative w-full aspect-[16/10] bg-linear-to-br from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <Image
                                src={featured.image_url || getBlogThumbnailPath(featured.slug || featured.id)}
                                alt={featured.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Tags */}
                            {featured.keywords?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {featured.keywords.slice(0, 3).map((kw) => (
                                        <span
                                            key={kw.id}
                                            className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                        >
                                            #{kw.keyword_name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {featured.title}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                                {featured.summary}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                <time dateTime={featured.created_at}>
                                    {formatDate(featured.created_at)}
                                </time>
                                {featured.authors?.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <span>bởi</span>
                                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                                            {featured.authors.map(a => a.name).join(', ')}
                                        </span>
                                    </span>
                                )}
                                {featured.views > 0 && (
                                    <span>{featured.views.toLocaleString()} lượt xem</span>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Side Cards — spans 2 cols, stacked vertically */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {rest.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.slug || blog.id}`}
                                className="group flex-1 flex flex-col rounded-[2rem] bg-white/70 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 p-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1"
                            >
                                {/* Tags */}
                                {blog.keywords?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {blog.keywords.slice(0, 2).map((kw) => (
                                            <span
                                                key={kw.id}
                                                className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300"
                                            >
                                                {kw.keyword_name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>

                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                                    {blog.summary}
                                </p>

                                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mt-auto">
                                    <time dateTime={blog.created_at}>
                                        {formatDate(blog.created_at)}
                                    </time>
                                    {blog.views > 0 && (
                                        <span>{blog.views.toLocaleString()} views</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Button */}
                <div className="mt-12 flex justify-center">
                    <ButtonLink href="/blog" content="XEM TẤT CẢ BÀI VIẾT" />
                </div>
            </div>
        </section>
    )
}
