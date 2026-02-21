import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Tags',
  description: 'Khám phá các chủ đề Blog và sự kiện của DUT AI Club theo từ khóa.',
  keywords: ['tags AI', 'chủ đề machine learning', 'danh mục blog AI', 'từ khóa trí tuệ nhân tạo'],
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  // Split tags: event tags = tags that appear on event posts
  const eventTagSet = new Set<string>()
  allBlogs.forEach((post) => {
    if (post.tags?.includes('event')) {
      post.tags?.forEach((t) => eventTagSet.add(t))
    }
  })

  const blogTags = tagKeys.filter((t) => !eventTagSet.has(t))
  const eventTags = tagKeys.filter((t) => eventTagSet.has(t) && t !== 'event')
  const allEventTagsWithEvent = tagKeys.filter((t) => eventTagSet.has(t))

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden py-14">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-200 opacity-30 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-rose-200 opacity-30 blur-3xl dark:opacity-10" />
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-800 dark:bg-primary-900/40 dark:text-primary-300">
            🏷 Danh mục
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-900 sm:text-5xl dark:text-white">
            Tags
          </h1>
          <p className="mt-3 text-base text-primary-600 dark:text-gray-400">
            Khám phá nội dung theo chủ đề — {tagKeys.length} tags tổng cộng.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 space-y-12">

        {/* ── Blog Tags ── */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-1 w-7 rounded-full bg-primary-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Blog Tags
            </h2>
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
              {blogTags.length}
            </span>
          </div>
          {blogTags.length === 0 ? (
            <p className="text-sm text-gray-400">Không có tag nào.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {blogTags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${slug(t)}`}
                  aria-label={`View posts tagged ${t}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm transition-all hover:border-primary-400 hover:bg-primary-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-primary-300 dark:hover:border-primary-500 dark:hover:bg-gray-700"
                >
                  {t}
                  <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-600 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300">
                    {tagCounts[t]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Event Tags ── */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-1 w-7 rounded-full bg-rose-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Event Tags
            </h2>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
              {allEventTagsWithEvent.length}
            </span>
          </div>
          {allEventTagsWithEvent.length === 0 ? (
            <p className="text-sm text-gray-400">Không có tag nào.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {allEventTagsWithEvent.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${slug(t)}`}
                  aria-label={`View posts tagged ${t}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-sm font-semibold text-rose-700 shadow-sm transition-all hover:border-rose-400 hover:bg-rose-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-rose-300 dark:hover:border-rose-500 dark:hover:bg-gray-700"
                >
                  {t}
                  <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 group-hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300">
                    {tagCounts[t]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
