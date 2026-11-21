import Link from '@/components/common/Link'
import SparkleIcon from '@/components/common/SparkleIcon'
import ButtonLink from '@/components/common/ButtonLink'
import type { PublicEvent } from 'app/api-client'
import Heading from './Heading'
import { parseEventDate } from '@/features/events/db/timeline'

function formatEventDate(dateStr?: string): string {
  if (!dateStr) return ''
  const date = parseEventDate(dateStr)
  return (
    date?.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    }) ?? ''
  )
}

export default function NewsSection({ events }: { events: PublicEvent[] }) {
  return (
    <section className="relative flex justify-center px-6 md:px-12">
      <div className="relative z-10 w-full max-w-6xl">
        <Heading
          heading="NEWS & EVENTS"
          subHeading="LATEST UPDATES"
          description="Cập nhật những sự kiện, workshop và hoạt động mới nhất từ DUT AI Club."
          badge="EVENTS"
          isSubHeadingEnter={true}
        />

        {/* Content */}
        {events.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-gray-400 dark:text-gray-500">
              Chưa có sự kiện nào.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <article
                key={event.id}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white bg-white/70 p-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 dark:border-gray-700/50 dark:bg-gray-800/80"
              >
                {/* Date & Location */}
                <div className="mb-3 flex items-center gap-3">
                  {event.events_date && (
                    <time
                      dateTime={event.events_date}
                      className="text-primary-400 dark:text-primary-300 text-xs font-semibold tracking-widest uppercase"
                    >
                      {formatEventDate(event.events_date)}
                    </time>
                  )}
                  {event.location && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      📍 {event.location}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-primary-900 mb-3 text-base leading-snug font-bold dark:text-white">
                  {event.facebook_url ? (
                    <Link href={event.facebook_url} className="hover:underline" target="_blank">
                      {event.title}
                    </Link>
                  ) : (
                    event.title
                  )}
                </h3>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {event.tags.slice(0, 3).map((tag) => (
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
                  {event.summary || event.description || ''}
                </p>

                {/* Register link */}
                {event.register_link && (
                  <div className="mt-4">
                    <Link
                      href={event.register_link}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      Đăng ký →
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Button */}
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/events" content="XEM TẤT CẢ SỰ KIỆN" />
        </div>
      </div>
    </section>
  )
}
