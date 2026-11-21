import ButtonLink from '@/components/common/ButtonLink'
import Image from 'next/image'
import type { Project } from 'app/api-client'
import Heading from './Heading'

const bgColors = ['bg-[#6A8F74]', 'bg-[#D97757]', 'bg-[#1E3A8A]', 'bg-[#9333EA]', 'bg-[#F59E0B]']

export default function PortfolioSection({ projects }: { projects: Project[] }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-12">
      {/* Header */}
      <Heading
        heading="PORTFOLIO"
        subHeading="AI INNOVATIONS"
        description="Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người. Triển lãm những dự án được phát triển bởi Câu lạc bộ DUT AI."
        badge="PROJECTS"
        isSubHeadingEnter={true}
      />

      {/* Project cards */}
      {!projects || projects.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-400 dark:text-gray-500">
            Chưa có dự án nào được công bố.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p, idx) => {
            const bg = bgColors[idx % bgColors.length]
            // Determine the main tag to display
            const mainTag = p.tags && p.tags.length > 0 ? p.tags[0] : 'AI'
            const img = p.image_url || p.imgSrc

            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800 dark:ring-gray-700"
              >
                {/* Thumbnail */}
                <div
                  className={`relative flex h-[260px] w-full items-center justify-center rounded-[24px] ${img ? '' : bg} overflow-hidden`}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="translate-y-2 text-[140px] leading-none font-normal text-white select-none">
                      {idx + 1}
                    </span>
                  )}

                  {/* HOT RELEASE badge */}
                  {idx === 0 && (
                    <span className="absolute top-4 left-4 z-10 rounded-full bg-[#2563EB] px-3 py-1 text-[10px] font-bold tracking-[0.05em] text-white uppercase shadow-md">
                      Hot Release
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 pt-6">
                  <span className="mb-3 w-fit rounded-md bg-[#2563EB]/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.05em] text-[#2563EB] uppercase">
                    {mainTag}
                  </span>
                  <h3 className="line-clamp-2 text-[24px] leading-[1.33] font-bold text-[#1E293B] dark:text-white">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[14px] leading-[1.625] text-[#475569] dark:text-gray-400">
                    {p.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-10 text-center">
        <ButtonLink href="/projects" content="Xem tất cả dự án" />
      </div>
    </section>
  )
}
