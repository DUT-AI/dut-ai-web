'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Target, Network } from 'lucide-react'
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
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
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
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
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
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Cầu nối học thuật và hợp tác dự án liên ngành',
    actionText: 'Khám phá các dự án',
    actionHref: '/projects',
    accentColor: '#059669',
    icon: Network,
  },
]

export default function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const card0Ref = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const cardRefs = [card0Ref, card1Ref, card2Ref]

  const [activeChapter, setActiveChapter] = useState(0)

  // Track overall scroll along the narrative container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 25%', 'end 85%'],
  })

  // Smoothly map scroll position to active chapter
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.35) {
      setActiveChapter(0)
    } else if (latest < 0.7) {
      setActiveChapter(1)
    } else {
      setActiveChapter(2)
    }
  })

  const scrollToChapter = (index: number) => {
    setActiveChapter(index)
    cardRefs[index].current?.scrollIntoView({
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
        <div className="pointer-events-none absolute -top-10 left-1/2 h-96 w-3/4 -translate-x-1/2 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[130px]" />

        {/* 60/40 Asymmetric Split Screen */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Pinned Visual Stage (Unobstructed Photo)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 sticky top-20 sm:top-24 lg:top-28 z-20">
            <div className="relative w-full">
              
              {/* Dynamic Colored Ambient Aura behind the Photo */}
              <div
                className="absolute -inset-4 sm:-inset-6 -z-10 rounded-[36px] blur-2xl opacity-40 transition-colors duration-700 pointer-events-none"
                style={{
                  backgroundColor:
                    activeChapter === 0
                      ? 'rgba(37,99,235,0.35)'
                      : activeChapter === 1
                      ? 'rgba(2,132,199,0.35)'
                      : 'rgba(5,150,105,0.35)',
                }}
              />

              {/* Main Photo Frame (100% visible - NOT covered by text) */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] lg:h-[480px] xl:h-[520px] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-200/80 dark:border-slate-800/90 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
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
                    className="absolute inset-0 w-full h-full pointer-events-none"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-slate-950/40 pointer-events-none" />
                  </m.div>
                ))}

                {/* Top Badge: Club Brand & Chapter Indicator */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/75 text-white backdrop-blur-md border border-white/15 shadow-md text-xs font-mono">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
                    style={{ backgroundColor: currentStory.accentColor }}
                  />
                  <span className="font-semibold tracking-wider">DUT AI CLUB</span>
                  <span className="text-white/30">/</span>
                  <span className="text-blue-300 font-bold">
                    0{activeChapter + 1} &middot; 0{stories.length}
                  </span>
                </div>

                {/* Bottom Bar: Title Caption & Clickable Progress Pills */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-end justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-mono tracking-widest uppercase text-white/60">
                      {currentStory.subtitle}
                    </p>
                    <h4 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md">
                      {currentStory.title}
                    </h4>
                  </div>

                  {/* Clickable Chapter Progress Indicators */}
                  <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-2 rounded-full border border-white/15">
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
          <div className="lg:col-span-5 relative z-10 flex flex-col gap-24 sm:gap-32 lg:gap-40 py-4 lg:py-12">
            {stories.map((story, idx) => {
              const isActive = activeChapter === idx
              const Icon = story.icon

              return (
                <div
                  key={story.id}
                  ref={cardRefs[idx]}
                  className={`min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-center transition-all duration-500 ${
                    isActive
                      ? 'opacity-100 scale-100'
                      : 'opacity-35 scale-[0.97] hover:opacity-65'
                  }`}
                >
                  <div
                    onClick={() => scrollToChapter(idx)}
                    className={`cursor-pointer group relative rounded-[28px] p-7 sm:p-9 transition-all duration-300 border ${
                      isActive
                        ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_45px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl ring-1 ring-slate-900/5 dark:ring-white/10'
                        : 'bg-white/50 dark:bg-slate-900/50 border-transparent'
                    }`}
                  >
                    {/* Chapter Tag Header */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105"
                          style={{ backgroundColor: story.accentColor }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                          Chương 0{idx + 1}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                        0{idx + 1} / 0{stories.length}
                      </span>
                    </div>

                    {/* Chapter Title */}
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                      {story.title}
                    </h3>

                    {/* Chapter Content Description */}
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-normal mb-6">
                      {story.description}
                    </p>

                    {/* Action Link Button */}
                    <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Hành trình Bách Khoa
                      </span>
                      <Link
                        href={story.actionHref}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group/link"
                      >
                        <span>{story.actionText}</span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 group-hover/link:bg-[#2563EB] group-hover/link:text-white transition-all">
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
