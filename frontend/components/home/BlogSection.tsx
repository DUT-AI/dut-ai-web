import Image from 'next/image'
import Link from '@/components/common/Link'
import SparkleIcon from '@/components/common/SparkleIcon'
import ButtonLink from '@/components/common/ButtonLink'
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
    <section className="relative flex justify-center px-6 md:px-12">
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <Heading
          heading="AI KNOWLEDGE"
          subHeading="FROM OUR BLOG"
          description="Khám phá kho tàng kiến thức công nghệ, nghiên cứu AI và các xu hướng lập trình mới nhất được tổng hợp bởi DUT AI Club."
          badge="BLOGS"
          isSubHeadingEnter={true}
        />

        {/* Magazine Layout: Featured left + Side cards right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Featured Card — spans 3 cols */}
          <Link
            href={`/blog/${featured.slug || featured.id}`}
            className="group relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 lg:col-span-3 dark:border-gray-700/50 dark:bg-gray-800/80"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full bg-linear-to-br from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
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
                <div className="mb-4 flex flex-wrap gap-2">
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

              <h3 className="mb-3 text-xl leading-snug font-extrabold text-gray-900 transition-colors group-hover:text-blue-600 md:text-2xl dark:text-white dark:group-hover:text-blue-400">
                {featured.title}
              </h3>

              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {featured.summary}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <time dateTime={featured.created_at}>{formatDate(featured.created_at)}</time>
                {featured.authors?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <span>bởi</span>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      {featured.authors.map((a) => a.name).join(', ')}
                    </span>
                  </span>
                )}
                {featured.views > 0 && <span>{featured.views.toLocaleString()} lượt xem</span>}
              </div>
            </div>
          </Link>

          {/* Side Cards — spans 2 cols, stacked vertically */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {rest.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug || blog.id}`}
                className="group flex flex-1 flex-col rounded-[2rem] border border-white bg-white/70 p-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 dark:border-gray-700/50 dark:bg-gray-800/80"
              >
                {/* Tags */}
                {blog.keywords?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {blog.keywords.slice(0, 2).map((kw) => (
                      <span
                        key={kw.id}
                        className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-800 uppercase dark:bg-indigo-900/40 dark:text-indigo-300"
                      >
                        {kw.keyword_name}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="mb-2 line-clamp-2 text-base leading-snug font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {blog.title}
                </h3>

                <p className="mb-3 line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
                  {blog.summary}
                </p>

                <div className="mt-auto flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                  {blog.views > 0 && <span>{blog.views.toLocaleString()} views</span>}
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
