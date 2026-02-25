import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'
import Main from '../../app/Main'
import ButtonLink from '@/components/ButtonLink'

export default function NewsSection({ posts }: { posts: any[] }) {
    return (
        <section className="relative px-6 py-20 lg:py-28 md:px-12 flex justify-center">
            <div className="w-full max-w-6xl relative z-10">
                {/* Header */}
                <div className="mb-14 text-center flex flex-col items-center">
                    <div className="mb-4 inline-flex items-center gap-2">
                        <SparkleIcon className="w-4 h-4 text-pink-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                            OUR LATEST UPDATES
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-4 text-[#101828] dark:text-white">
                        Tin tức &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">Sự kiện</span>
                    </h2>
                    <p className="max-w-xl text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                        Cập nhật những thông tin, kiến thức và sự kiện mới nhất từ DUT AI Club.
                    </p>
                </div>

                <Main posts={posts} />

                {/* Button */}
                <div className="mt-12 flex justify-center">
                    <ButtonLink href="/blog" content="TẤT CẢ TÀI LIỆU" />
                </div>
            </div>
        </section>
    )
}
