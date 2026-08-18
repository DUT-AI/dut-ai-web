import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'
import ButtonLink from '@/components/ButtonLink'
import type { PublicEvent } from 'app/api-client'
import Heading from './Heading'

function formatEventDate(dateStr?: string): string {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function NewsSection({ events }: { events: PublicEvent[] }) {
    return (
        <section className="relative px-6 md:px-12 flex justify-center">
            <div className="w-full max-w-6xl relative z-10">
                <Heading heading="NEWS & EVENTS" subHeading="LATEST UPDATES" description="Cập nhật những sự kiện, workshop và hoạt động mới nhất từ DUT AI Club." badge="EVENTS" isSubHeadingEnter={true} />

                {/* Content */}
                {events.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-lg text-gray-400 dark:text-gray-500 font-medium">
                            Chưa có sự kiện nào.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.slice(0, 3).map((event) => (
                            <article
                                key={event.id}
                                className="group flex flex-col rounded-[2rem] border border-white dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/80 backdrop-blur-md p-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden"
                            >
                                {/* Date & Location */}
                                <div className="flex items-center gap-3 mb-3">
                                    {event.events_date && (
                                        <time
                                            dateTime={event.events_date}
                                            className="text-xs font-semibold uppercase tracking-widest text-primary-400 dark:text-primary-300"
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
                                <h3 className="mb-3 text-base font-bold leading-snug text-primary-900 dark:text-white">
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
                                                className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Summary */}
                                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-primary-600 dark:text-gray-400">
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
