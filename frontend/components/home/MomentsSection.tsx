import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'
import ButtonLink from '@/components/ButtonLink'

export default function MomentsSection() {
    return (
        <section className="relative px-6 py-20 lg:py-28 md:px-12 flex justify-center">
            <div className="w-full max-w-6xl relative z-10">
                {/* Header */}
                <div className="mb-14 text-center flex flex-col items-center">
                    <div className="mb-4 inline-flex items-center gap-2">
                        <SparkleIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                            DIGITAL SCRAPBOOK
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-[70px] font-black tracking-tighter leading-tight mb-4">
                        <span className="text-[#101828] dark:text-white">DUT AI </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                            Moments
                        </span>
                    </h2>
                    <p className="max-w-xl text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                        A dynamic collection of our journey in Artificial Intelligence. Modern, organic, and full of life.
                    </p>
                </div>

                {/* Masonry-style grid using Columns */}
                <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
                    {[
                        {
                            tag: '#WORKSHOP',
                            title: 'Deep Learning Series',
                            sub: 'Session #01: Neural Networks',
                            tall: false,
                            bgTop: 'bg-[#92857a]',
                            tagStyle: 'top-4 right-[-10px] rotate-[15deg]',
                        },
                        {
                            tag: '#SHOWCASE',
                            title: 'Demo Day',
                            sub: 'Pitching AI solutions',
                            tall: true,
                            bgTop: 'bg-[#f4efe8]',
                            tagStyle: 'bottom-8 right-[-24px] -rotate-90',
                        },
                        {
                            tag: '< > PAIR DEV',
                            title: 'Collaborative Coding',
                            sub: 'Building the core engine',
                            tall: true,
                            bgTop: 'bg-[#2f7366] dark:bg-[#1a4a40]',
                            tagStyle: 'bottom-4 left-4',
                        },
                        {
                            tag: '#TEAMWORK',
                            title: 'Weekly Sync',
                            sub: 'Strategy & Planning',
                            tall: true,
                            bgTop: 'bg-[#a3c9a8] dark:bg-[#6b8c70]',
                            tagStyle: 'top-8 left-4 -rotate-12',
                        },
                        {
                            tag: '#IDEATION',
                            title: 'Ideation Night',
                            sub: 'Midnight thoughts',
                            tall: false,
                            bgTop: 'bg-[#d8e0e3] dark:bg-[#859499]',
                            tagStyle: 'bottom-4 right-4',
                        },
                        {
                            tag: '✨',
                            title: 'Lab Session',
                            sub: 'Hands-on experimentation',
                            tall: true,
                            bgTop: 'bg-[#94b8b8] dark:bg-[#5a7c7c]',
                            tagStyle: 'top-4 left-4 !rounded-full !w-8 !h-8 flex items-center justify-center p-0',
                        },
                        {
                            tag: 'CONNECTED',
                            title: 'Networking',
                            sub: 'Industry connections',
                            tall: true,
                            bgTop: 'bg-[#3b8c80] dark:bg-[#1f5a50]',
                            tagStyle: 'bottom-8 right-4 rotate-12 text-blue-500',
                        },
                        {
                            tag: '#CELEBRATION',
                            title: 'Team Bonding',
                            sub: 'Milestones & Memories',
                            tall: false,
                            bgTop: 'bg-[#a5ccb5] dark:bg-[#6c8c78]',
                            tagStyle: 'top-4 right-4',
                        },
                    ].map((m) => (
                        <div
                            key={m.title}
                            className="break-inside-avoid bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-[2rem] p-3 pb-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] border border-white dark:border-gray-700/50 hover:-translate-y-1 transition-transform duration-300"
                        >
                            {/* Image Placeholder */}
                            <div
                                className={`relative w-full rounded-[1.5rem] overflow-hidden mb-5 ${m.bgTop} ${m.tall ? 'aspect-[4/5]' : 'aspect-video'
                                    }`}
                            >
                                {/* Floating Tag */}
                                <div
                                    className={`absolute bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-gray-700 dark:text-gray-200 shadow-sm border border-white/50 dark:border-gray-600 whitespace-nowrap ${m.tagStyle}`}
                                >
                                    {m.tag}
                                </div>
                            </div>

                            <div className="px-3">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {m.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {m.sub}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="mt-16 flex justify-center">
                    <ButtonLink href="/events" content="VIEW FULL ALBUM" />
                </div>
            </div>
        </section>
    )
}
