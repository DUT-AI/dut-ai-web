'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { LazyMotion, domAnimation, useScroll, useTransform, m, MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

interface ActivityCardData {
  title: string
  category: string
  description: string
  accentGradient: string // Top accent line gradient
  badgeClass: string // Theme-adaptive badge pill
  glowClass: string // Corner ambient glow
  actionColor: string // Action text & icon accent
  image: string
  tags: string[]
}

const activities: ActivityCardData[] = [
  {
    title: 'Dự án Lab & R&D Sản phẩm',
    category: 'LAB WORK',
    description:
      'Trực tiếp tham gia nghiên cứu, thiết kế kiến trúc và phát triển các sản phẩm AI thực tế. Được đồng hành và hướng dẫn 1-1 cùng đội ngũ kỹ sư và giảng viên chuyên gia.',
    accentGradient: 'from-[#2563EB] via-[#3B82F6] to-[#60A5FA]',
    badgeClass:
      'bg-blue-50 text-blue-600 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60',
    glowClass: 'bg-blue-500/10 dark:bg-blue-500/15',
    actionColor: 'text-blue-600 dark:text-blue-400',
    image: '/static/images/IMG_10.jpg',
    tags: ['Production AI', 'Full-Stack ML', 'Mentorship'],
  },
  {
    title: 'Chinh chiến các giải Hackathons',
    category: 'COMPETITION',
    description:
      'Thử thách bản thân trong môi trường áp lực cao 24h - 48h liên tục. Biến ý tưởng đột phá thành nguyên mẫu giải pháp AI hoạt động thực tế và chinh phục ban giám khảo.',
    accentGradient: 'from-[#EC4899] via-[#F43F5E] to-[#FB7185]',
    badgeClass:
      'bg-pink-50 text-pink-600 border-pink-200/80 dark:bg-pink-950/60 dark:text-pink-400 dark:border-pink-800/60',
    glowClass: 'bg-pink-500/10 dark:bg-pink-500/15',
    actionColor: 'text-pink-600 dark:text-pink-400',
    image: '/static/images/IMG_08.JPEG',
    tags: ['48h Sprint', 'Team Collaboration', 'Problem Solving'],
  },
  {
    title: 'Nghiên cứu Khoa học & Công bố',
    category: 'ACADEMIC',
    description:
      'Đào sâu các bài toán học máy tiên tiến, thực nghiệm trên cụm GPU của lab và hướng đến việc công bố các bài báo tại các hội nghị, tạp chí khoa học uy tín (Scopus/ISI).',
    accentGradient: 'from-[#191970] via-[#1E3A8A] to-[#2563EB]',
    badgeClass:
      'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/60',
    glowClass: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    actionColor: 'text-indigo-600 dark:text-indigo-400',
    image: '/static/images/IMG_06.jpeg',
    tags: ['Research Paper', 'GPU Clusters', 'Novel Architecture'],
  },
  {
    title: 'Cộng đồng & Mạng lưới DUT AI',
    category: 'COMMUNITY',
    description:
      'Kết nối mạng lưới cựu sinh viên, giao lưu cùng các chuyên gia hàng đầu đang làm việc tại các tập đoàn công nghệ lớn. Mở rộng cơ hội thực tập, việc làm và học bổng.',
    accentGradient: 'from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]',
    badgeClass:
      'bg-sky-50 text-sky-600 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/60',
    glowClass: 'bg-sky-500/10 dark:bg-sky-500/15',
    actionColor: 'text-sky-600 dark:text-sky-400',
    image: '/static/images/IMG_07.JPG',
    tags: ['Alumni Network', 'Tech Sharing', 'Career Pathway'],
  },
  {
    title: 'Workshops & Masterclasses Chuyên sâu',
    category: 'WORKSHOPS',
    description:
      'Tổ chức các buổi sharing cho cộng đồng về các chủ đề về AI và Nghiên cứu khoa học',
    accentGradient: 'from-[#1D4ED8] via-[#2563EB] to-[#0284C7]',
    badgeClass:
      'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60',
    glowClass: 'bg-blue-500/10 dark:bg-blue-500/15',
    actionColor: 'text-blue-600 dark:text-blue-400',
    image: '/static/images/IMG_05.JPG',
    tags: ['Monthly Talks', 'Hands-on Labs', 'Industry Speakers'],
  },
]

export default function PhaseTwoExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="relative w-full">
        {/* Stacking Cards List */}
        <div className="flex flex-col gap-12 pb-24">
          {activities.map((item, idx) => {
            // Target scale down slightly as subsequent cards overlay on top
            const targetScale = 1 - (activities.length - 1 - idx) * 0.04
            return (
              <StackingCard
                key={item.title}
                item={item}
                index={idx}
                total={activities.length}
                progress={scrollYProgress}
                range={[idx * 0.15, 1]}
                targetScale={targetScale}
              />
            )
          })}
        </div>
      </div>
    </LazyMotion>
  )
}

interface StackingCardProps {
  item: ActivityCardData
  index: number
  total: number
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

function StackingCard({ item, index, total, progress, range, targetScale }: StackingCardProps) {
  // Scale down when subsequent cards slide up on top of this card
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      className="sticky top-28 flex w-full items-center justify-center"
      style={{
        zIndex: index + 1,
      }}
    >
      <m.div
        style={{
          scale,
          top: `calc(10px + ${index * 24}px)`,
        }}
        className="relative w-full overflow-hidden rounded-[36px] border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 sm:p-8 md:p-12 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Top accent gradient bar */}
        <div
          className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${item.accentGradient}`}
        />

        {/* Ambient background glow */}
        <div
          className={`absolute -top-20 -right-20 h-80 w-80 rounded-full ${item.glowClass} pointer-events-none blur-3xl`}
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Left Text Content: 6 - 7 cols */}
          <div className="flex h-full flex-col justify-between md:col-span-6 lg:col-span-7">
            <div>
              {/* Category Badge & Index Indicator */}
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`rounded-full border px-3.5 py-1.5 text-[11px] font-extrabold tracking-widest uppercase backdrop-blur-md ${item.badgeClass}`}
                >
                  {item.category}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Phase 02 • 0{index + 1} / 0{total}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl leading-[1.2] font-extrabold tracking-tight text-[#1E293B] sm:text-3xl lg:text-4xl dark:text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mb-6 max-w-xl text-sm leading-relaxed font-normal text-[#475569] sm:text-base dark:text-slate-300">
                {item.description}
              </p>
            </div>

            {/* Tags & Action row */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/80">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-slate-200/60 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}

              <div
                className={`ml-auto hidden items-center gap-1.5 text-xs font-bold sm:flex ${item.actionColor} group cursor-pointer transition-opacity hover:opacity-80`}
              >
                <span>Khám phá</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Right Visual Image Card: 5 - 6 cols */}
          <div className="w-full md:col-span-6 lg:col-span-5">
            <div className="group relative h-[220px] w-full overflow-hidden rounded-[24px] border border-slate-200/80 shadow-xl sm:h-[260px] md:h-[300px] dark:border-slate-700/60">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </m.div>
    </div>
  )
}
