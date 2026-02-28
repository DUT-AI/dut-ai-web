import Link from '@/components/Link'
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
            className="group flex flex-col rounded-[2rem] border border-white dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/80 backdrop-blur-md p-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Date */}
            <time
              dateTime={date}
              className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-400 dark:text-primary-300"
            >
              {formatDate(date, siteMetadata.locale)}
            </time>

            {/* Title */}
            <h3 className="mb-3 text-base font-bold leading-snug text-primary-900 dark:text-white">
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
                    className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-primary-600 dark:text-gray-400">
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
