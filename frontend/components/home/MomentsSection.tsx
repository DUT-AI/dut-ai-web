import Image from 'next/image'
import SparkleIcon from '@/components/common/SparkleIcon'
import ButtonLink from '@/components/common/ButtonLink'
import type { Post } from 'app/api-client'
import Heading from './Heading'
import { parseImageUrls } from '@/features/events/db/timeline'

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
  {
    bgTop: 'bg-[#3b8c80] dark:bg-[#1f5a50]',
    tall: true,
    tagStyle: 'bottom-8 right-4 rotate-12 text-blue-500',
  },
  { bgTop: 'bg-[#a5ccb5] dark:bg-[#6c8c78]', tall: false, tagStyle: 'top-4 right-4' },
]

export default function MomentsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="relative flex justify-center px-6 md:px-12">
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}

        <Heading
          heading="DUT AI"
          subHeading="Moments"
          description="Những khoảnh khắc đáng nhớ trong hành trình Trí tuệ Nhân tạo của chúng tôi."
          badge="DIGITAL SCRAPBOOK"
        />

        {/* Content */}
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-gray-400 dark:text-gray-500">
              Chưa có khoảnh khắc nào được chia sẻ.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-4">
            {posts.slice(0, 8).map((post, index) => {
              // Handle legacy rows/cache entries where an array element contains
              // the full Python-style list representation.
              const urls = parseImageUrls(post.img_urls)
              const coverImage = urls.length > 0 ? urls[0] : undefined
              const style = cardStyles[index % cardStyles.length]
              const tag = post.hashtag && post.hashtag !== 'None' ? post.hashtag : undefined

              return (
                <div
                  key={post.id}
                  className="break-inside-avoid rounded-[2rem] border border-white bg-white/80 p-3 pb-6 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 dark:border-gray-700/50 dark:bg-gray-800/80"
                >
                  {/* Image / Placeholder */}
                  <div
                    className={`relative mb-5 w-full overflow-hidden rounded-[1.5rem] ${!coverImage ? style.bgTop : ''} ${style.tall ? 'aspect-[4/5]' : 'aspect-video'}`}
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
                        className={`absolute rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-widest whitespace-nowrap text-gray-700 shadow-sm backdrop-blur-md sm:text-[11px] dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200 ${style.tagStyle}`}
                      >
                        {tag}
                      </div>
                    )}
                  </div>

                  <div className="px-3">
                    <h3 className="mb-1 line-clamp-2 text-base font-bold text-gray-900 sm:text-lg dark:text-white">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
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
