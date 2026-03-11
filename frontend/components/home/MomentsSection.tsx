import Image from 'next/image'
import SparkleIcon from '@/components/SparkleIcon'
import ButtonLink from '@/components/ButtonLink'
import type { Post } from 'app/api-client'
import Heading from './Heading'

// Each slot has a unique visual style — matching the original design
const cardStyles = [
    { bgTop: 'bg-[#92857a]', tall: false, tagStyle: 'top-4 right-4' },
    { bgTop: 'bg-[#f4efe8]', tall: true, tagStyle: 'bottom-6 left-4 rotate-6' },
    { bgTop: 'bg-[#2f7366] dark:bg-[#1a4a40]', tall: true, tagStyle: 'bottom-4 left-4' },
    { bgTop: 'bg-[#a3c9a8] dark:bg-[#6b8c70]', tall: true, tagStyle: 'top-8 left-4 -rotate-12' },
    { bgTop: 'bg-[#d8e0e3] dark:bg-[#859499]', tall: false, tagStyle: 'bottom-4 right-4' },
    {
        bgTop: 'bg-[#94b8b8] dark:bg-[#5a7c7c]',
        tall: true,
        tagStyle: 'top-4 left-4',
    },
    { bgTop: 'bg-[#3b8c80] dark:bg-[#1f5a50]', tall: true, tagStyle: 'bottom-8 right-4 rotate-12 text-blue-500' },
    { bgTop: 'bg-[#a5ccb5] dark:bg-[#6c8c78]', tall: false, tagStyle: 'top-4 right-4' },
]

export default function MomentsSection({ posts }: { posts: Post[] }) {
    return (
        <section className="relative px-6 md:px-12 flex justify-center">
            <div className="w-full max-w-6xl relative z-10">
                {/* Header */}

                <Heading heading="DUT AI" subHeading="Moments" description="Những khoảnh khắc đáng nhớ trong hành trình Trí tuệ Nhân tạo của chúng tôi." badge="DIGITAL SCRAPBOOK" />

                {/* Content */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-lg text-gray-400 dark:text-gray-500 font-medium">
                            Chưa có khoảnh khắc nào được chia sẻ.
                        </p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
                        {posts.slice(0, 8).map((post, index) => {
                            // Safe extraction: ensure img_urls is a real array
                            const urls = Array.isArray(post.img_urls) ? post.img_urls : []
                            const coverImage = urls.length > 0 ? urls[0] : undefined
                            const style = cardStyles[index % cardStyles.length]
                            const tag = post.hashtag && post.hashtag !== 'None' ? post.hashtag : undefined

                            return (
                                <div
                                    key={post.id}
                                    className="break-inside-avoid bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-[2rem] p-3 pb-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] border border-white dark:border-gray-700/50 hover:-translate-y-1 transition-transform duration-300"
                                >
                                    {/* Image / Placeholder */}
                                    <div
                                        className={`relative w-full rounded-[1.5rem] overflow-hidden mb-5 ${!coverImage ? style.bgTop : ''} ${style.tall ? 'aspect-[4/5]' : 'aspect-video'}`}
                                    >
                                        {coverImage ? (
                                            <Image
                                                src={coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        ) : null}

                                        {/* Floating Tag — unique position per card slot */}
                                        {tag && (
                                            <div
                                                className={`absolute bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-gray-700 dark:text-gray-200 shadow-sm border border-white/50 dark:border-gray-600 whitespace-nowrap ${style.tagStyle}`}
                                            >
                                                {tag}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-3">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                                            {post.description || post.summary || ''}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Button */}
                <div className="mt-16 flex justify-center">
                    <ButtonLink href="/events" content="XEM ALBUM ĐẦY ĐỦ" />
                </div>
            </div>
        </section>
    )
}
