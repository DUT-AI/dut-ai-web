import Link from '@/components/common/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 3

export default function Home({ posts }) {
  if (!posts.length) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.slice(0, MAX_DISPLAY).map((post) => {
        const { slug, date, title, summary, tags } = post
        return (
          <article
            key={slug}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white bg-white/70 p-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 dark:border-gray-700/50 dark:bg-gray-800/80"
          >
            {/* Date */}
            <time
              dateTime={date}
              className="text-primary-400 dark:text-primary-300 mb-2 text-xs font-semibold tracking-widest uppercase"
            >
              {formatDate(date, siteMetadata.locale)}
            </time>

            {/* Title */}
            <h3 className="text-primary-900 mb-3 text-base leading-snug font-bold dark:text-white">
              <Link href={`/blog/${slug}`} className="hover:underline">
                {title}
              </Link>
            </h3>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-rose-800 uppercase dark:bg-rose-900/40 dark:text-rose-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            <p className="text-primary-600 line-clamp-3 flex-1 text-sm leading-relaxed dark:text-gray-400">
              {summary}
            </p>

            {/* Read more */}
            <div className="mt-4">
              <Link
                href={`/blog/${slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
              >
                Đọc thêm →
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
