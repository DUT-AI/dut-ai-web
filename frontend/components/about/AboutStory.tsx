'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Target, Network, Compass } from 'lucide-react'
import { LazyMotion, domAnimation, m, useScroll, useMotionValueEvent } from 'motion/react'

interface StoryItemData {
  id: string
  stepNumber: string
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  actionText: string
  actionHref: string
  accentColor: string
  icon: React.ComponentType<{ className?: string }>
}

const stories: StoryItemData[] = [
  {
    id: 'who-we-are',
    stepNumber: '01',
    title: 'Chúng tôi là ai?',
    subtitle: 'Khởi nguồn & Đam mê',
    description:
      'DUT AI Club là câu lạc bộ học thuật trực thuộc Trường Đại học Bách Khoa — ĐHĐN. Chúng tôi tập hợp những sinh viên đam mê AI, cùng nhau khám phá, nghiên cứu và ứng dụng Trí tuệ Nhân tạo vào giải quyết các bài toán thực tiễn.',
    image: '/static/images/IMG_04.JPG',
    imageAlt: 'DUT AI Club - Chúng tôi là ai',
    actionText: 'Tìm hiểu các thế hệ',
    actionHref: '#members',
    accentColor: '#2563EB',
    icon: Sparkles,
  },
  {
    id: 'our-mission',
    stepNumber: '02',
    title: 'Sứ mệnh của chúng mình',
    subtitle: 'Làm chủ công nghệ từ bản chất',
    description:
      'Dù mới được thành lập gần một năm, DUT AI CLUB luôn kiên định với sứ mệnh: đồng hành và hướng dẫn các bạn sinh viên từng bước làm chủ công nghệ AI từ bản chất, tự tay lập trình từ những nền tảng cốt lõi nhất thay vì chỉ phụ thuộc vào công cụ có sẵn, để từ đó tự tin ứng dụng AI vào việc giải quyết các bài toán thiết thực trong các lĩnh vực đời sống.',
    image: '/static/images/IMG_03.jpeg',
    imageAlt: 'Sứ mệnh đào tạo AI thực chiến tại DUT AI Club',
    actionText: 'Xem lộ trình học',
    actionHref: '/#roadmap',
    accentColor: '#0284C7',
    icon: Target,
  },
  {
    id: 'collaboration',
    stepNumber: '03',
    title: 'Cầu nối liên ngành & Dự án',
    subtitle: 'Đồng hành kiến tạo giá trị',
    description:
      'Bên cạnh các hoạt động nội bộ, chúng mình hiểu rằng AI chỉ phát huy tối đa sức mạnh khi được đặt vào những lĩnh vực cụ thể và tạo ra giá trị thực tế. Vì vậy, CLB luôn hướng tới mục tiêu trở thành cầu nối học thuật, mong muốn mở rộng hợp tác cùng quý thầy cô và các bạn sinh viên từ tất cả các khoa, các chuyên ngành khác nhau để cùng phát triển các dự án liên ngành thực tế và tự tin thử sức ở những sân chơi công nghệ lớn.',
    image: '/static/images/IMG_02.jpeg',
    imageAlt: 'Cầu nối học thuật và hợp tác dự án liên ngành',
    actionText: 'Khám phá các dự án',
    actionHref: '/projects',
    accentColor: '#059669',
    icon: Network,
  },
  {
    id: 'community-and-life',
    stepNumber: '04',
    title: 'Gắn kết, Sự kiện & Trải nghiệm',
    subtitle: 'Hơn cả một câu lạc bộ',
    description:
      'Không chỉ có những dòng code hay mô hình thuật toán, DUT AI Club còn là ngôi nhà chung với những chuyến dã ngoại, teambuilding, boardgame night và các sự kiện giao lưu sôi nổi. Tại đây, chúng mình cùng học, cùng chơi, sẻ chia kinh nghiệm và lưu giữ những kỷ niệm thanh xuân rực rỡ nhất thời sinh viên Bách Khoa.',
    image: '/static/images/IMG_01.JPG',
    imageAlt: 'Sự kiện, giao lưu kết nối và hoạt động dã ngoại tại DUT AI Club',
    actionText: 'Khám phá sự kiện',
    actionHref: '/events',
    accentColor: '#D97706',
    icon: Compass,
  },
]

export default function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [activeChapter, setActiveChapter] = useState(0)

  // Track overall scroll along the narrative container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 25%', 'end 85%'],
  })

  // Smoothly map scroll position to active chapter dynamically
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const totalStories = stories.length
    const rawIndex = Math.floor(latest * totalStories)
    const clampedIndex = Math.min(Math.max(rawIndex, 0), totalStories - 1)
    setActiveChapter(clampedIndex)
  })

  const scrollToChapter = (index: number) => {
    setActiveChapter(index)
    cardRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const currentStory = stories[activeChapter]

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={containerRef}
        className="relative w-full py-8 sm:py-12 lg:py-16"
        aria-label="DUT AI Club Story"
      >
        {/* Ambient Backlight Glow for the entire section */}
        <div className="pointer-events-none absolute -top-10 left-1/2 h-96 w-3/4 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/10" />

        {/* 60/40 Asymmetric Split Screen */}
        <div className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Pinned Visual Stage (Unobstructed Photo)     */}
          {/* ========================================================= */}
          <div className="sticky top-20 z-20 sm:top-24 lg:top-28 lg:col-span-7">
            <div className="relative w-full">
              {/* Dynamic Colored Ambient Aura behind the Photo */}
              <div
                className="pointer-events-none absolute -inset-4 -z-10 rounded-[36px] opacity-40 blur-2xl transition-colors duration-700 sm:-inset-6"
                style={{
                  backgroundColor: currentStory.accentColor + '55',
                }}
              />

              {/* Main Photo Frame (100% visible - NOT covered by text) */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:aspect-[16/10] sm:rounded-[32px] lg:h-[480px] xl:h-[520px] dark:border-slate-800/90 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                {stories.map((story, idx) => (
                  <m.div
                    key={story.id}
                    initial={false}
                    animate={{
                      opacity: activeChapter === idx ? 1 : 0,
                      scale: activeChapter === idx ? 1 : 1.06,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      priority={idx === 0}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 750px"
                    />
                    {/* Subtle bottom vignette to ensure top & bottom status bars are legible */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-slate-950/40" />
                  </m.div>
                ))}

                {/* Top Badge: Club Brand & Chapter Indicator */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 rounded-full border border-white/15 bg-slate-950/75 px-3.5 py-1.5 font-mono text-xs text-white shadow-md backdrop-blur-md sm:top-6 sm:left-6">
                  <span
                    className="h-2 w-2 animate-pulse rounded-full transition-colors duration-500"
                    style={{ backgroundColor: currentStory.accentColor }}
                  />
                  <span className="font-semibold tracking-wider">DUT AI CLUB</span>
                  <span className="text-white/30">/</span>
                  <span className="font-bold text-blue-300">
                    0{activeChapter + 1} &middot; 0{stories.length}
                  </span>
                </div>

                {/* Bottom Bar: Title Caption & Clickable Progress Pills */}
                <div className="absolute right-4 bottom-4 left-4 z-20 flex items-end justify-between gap-4 sm:right-6 sm:bottom-6 sm:left-6">
                  <div className="space-y-0.5">
                    <p className="font-mono text-[11px] tracking-widest text-white/60 uppercase">
                      {currentStory.subtitle}
                    </p>
                    <h4 className="text-sm font-bold tracking-tight text-white drop-shadow-md sm:text-base">
                      {currentStory.title}
                    </h4>
                  </div>

                  {/* Clickable Chapter Progress Indicators */}
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-3 py-2 backdrop-blur-md">
                    {stories.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToChapter(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeChapter === i
                            ? 'w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                            : 'w-2 bg-white/35 hover:bg-white/60'
                        }`}
                        aria-label={`Chuyển đến chương 0${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Scrolling Narrative Stream (Story Cards)    */}
          {/* ========================================================= */}
          <div className="relative z-10 flex flex-col gap-24 py-4 sm:gap-32 lg:col-span-5 lg:gap-40 lg:py-12">
            {stories.map((story, idx) => {
              const isActive = activeChapter === idx
              const Icon = story.icon

              return (
                <div
                  key={story.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el
                  }}
                  className={`flex min-h-[50vh] flex-col justify-center transition-all duration-500 sm:min-h-[60vh] ${
                    isActive ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-35 hover:opacity-65'
                  }`}
                >
                  <div
                    onClick={() => scrollToChapter(idx)}
                    className={`group relative cursor-pointer rounded-[28px] border p-7 transition-all duration-300 sm:p-9 ${
                      isActive
                        ? 'border-slate-200/90 bg-white/95 shadow-[0_20px_45px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_25px_50px_rgba(0,0,0,0.4)] dark:ring-white/10'
                        : 'border-transparent bg-white/50 dark:bg-slate-900/50'
                    }`}
                  >
                    {/* Chapter Tag Header */}
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105"
                          style={{ backgroundColor: story.accentColor }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                          Chương 0{idx + 1}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                        0{idx + 1} / 0{stories.length}
                      </span>
                    </div>

                    {/* Chapter Title */}
                    <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                      {story.title}
                    </h3>

                    {/* Chapter Content Description */}
                    <p className="mb-6 text-sm leading-relaxed font-normal text-slate-600 sm:text-base dark:text-slate-300">
                      {story.description}
                    </p>

                    {/* Action Link Button */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800/80">
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Hành trình Bách Khoa
                      </span>
                      <Link
                        href={story.actionHref}
                        onClick={(e) => e.stopPropagation()}
                        className="group/link inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] transition-colors hover:text-blue-700 sm:text-sm dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <span>{story.actionText}</span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 transition-all group-hover/link:bg-[#2563EB] group-hover/link:text-white dark:bg-blue-950/60">
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </LazyMotion>
  )
}
