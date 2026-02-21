import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import AboutUs from '@/components/AboutUs'
import OrgSystem from '@/components/OrgSystem'
import EventImagePool from '@/components/EventImagePool'
import Link from '@/components/Link'

/* ─── Sparkle icon ─── */
function Sparkle({ size = 20, className = '', style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  )
}

/* ─── Section label ─── */
function SectionLabel({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className={`h-1 w-7 rounded-full ${colorClass}`} />
      <span className={`text-xs font-bold uppercase tracking-widest ${colorClass.replace('bg-', 'text-')}`}>
        {label}
      </span>
    </div>
  )
}

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return (
    <div className="min-h-screen pb-16">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary-300 opacity-30 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 h-[400px] w-[400px] rounded-full bg-rose-300 opacity-25 blur-3xl dark:opacity-10" />

        {/* Sparkle decorators */}
        <Sparkle size={18} className="text-primary-400 absolute opacity-50 dark:opacity-30" style={{ top: 52, left: '18%' }} />
        <Sparkle size={12} className="text-rose-400 absolute opacity-45 dark:opacity-25" style={{ top: 80, left: '60%' }} />
        <Sparkle size={22} className="text-primary-600 absolute opacity-40 dark:opacity-20" style={{ top: 160, right: '12%' }} />
        <Sparkle size={10} className="text-primary-400 absolute opacity-35 dark:opacity-20" style={{ bottom: 80, left: '35%' }} />

        <div className="relative z-10 px-6 md:px-12">
          <div className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">

            {/* Text */}
            <div className="min-w-0 flex-1">
              {/* Badge */}
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-900 dark:bg-rose-900/40 dark:text-rose-300">
                ✦ DUT AI Club · ĐH Bách khoa Đà Nẵng
              </span>

              {/* Headline */}
              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-primary-900 sm:text-5xl md:text-[3.5rem] dark:text-white">
                Nghiên cứu.{' '}
                <span className="text-rose-500 dark:text-rose-400">Sáng tạo.</span>
                <br />
                Kết nối AI.
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-primary-600 md:text-lg dark:text-gray-400">
                Cộng đồng AI sinh viên — nơi bạn học hỏi, nghiên cứu và cùng nhau
                xây dựng tương lai công nghệ.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-95 dark:bg-primary-700"
                >
                  Khám phá Blog →
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-95 dark:bg-rose-600"
                >
                  Khám phá Event →
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary-300 px-6 py-2.5 text-sm font-bold text-primary-700 transition-all hover:border-primary-500 hover:bg-primary-50 active:scale-95 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-900/20"
                >
                  Xem Projects
                </Link>
              </div>
            </div>

            {/* Stat cards — desktop */}
            <div className="hidden flex-col gap-3 md:flex md:w-64 lg:w-72">
              {[
                { value: '30+', label: 'Thành viên tích cực', cls: 'bg-primary-50 text-primary-900 dark:bg-primary-900/30 dark:text-primary-200' },
                { value: '5+', label: 'Năm thành lập CLB', cls: 'bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-300' },
                { value: '20+', label: 'Sự kiện đã tổ chức', cls: 'bg-primary-100 text-primary-800 dark:bg-primary-800/30 dark:text-primary-300' },
                { value: `${posts.length}`, label: 'Bài viết đã đăng', cls: 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200' },
              ].map((stat) => (
                <div key={stat.label} className={`flex items-center gap-4 rounded-2xl px-5 py-4 shadow-sm ${stat.cls}`}>
                  <span className="text-3xl font-extrabold tabular-nums">{stat.value}</span>
                  <span className="text-xs font-semibold leading-tight opacity-80">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile stats */}
          <div className="mt-8 grid grid-cols-3 gap-3 md:hidden">
            {[
              { value: '30+', label: 'Thành viên' },
              { value: '5+', label: 'Năm CLB' },
              { value: '20+', label: 'Sự kiện' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center rounded-xl bg-primary-50 py-3 shadow-sm dark:bg-primary-900/30">
                <span className="text-xl font-extrabold text-primary-900 dark:text-primary-200">{stat.value}</span>
                <span className="mt-0.5 text-center text-[10px] font-semibold text-primary-600 dark:text-primary-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GIỚI THIỆU
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-8 md:px-12 border-t border-primary-100 dark:border-gray-800">
        <SectionLabel label="Giới thiệu" colorClass="bg-primary-400 text-primary-600 dark:text-primary-400" />
        <AboutUs />
      </section>

      {/* ═══════════════════════════════════════════
          ĐỘI NGŨ
      ═══════════════════════════════════════════ */}
      <section className="py-8 bg-rose-50 dark:bg-gray-900 border-t border-rose-100 dark:border-gray-800">
        <div className="px-6 md:px-12">
          <SectionLabel label="Đội ngũ" colorClass="bg-rose-400 text-rose-600 dark:text-rose-400" />
        </div>
        <OrgSystem />
      </section>

      {/* ═══════════════════════════════════════════
          KHOẢNH KHẮC
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-8 md:px-12 border-t border-primary-100 dark:border-gray-800">
        <SectionLabel label="Khoảnh khắc" colorClass="bg-primary-400 text-primary-600 dark:text-primary-400" />
        <EventImagePool posts={posts} />
      </section>

      {/* ═══════════════════════════════════════════
          TIN TỨC
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-8 md:px-12 bg-primary-50 dark:bg-gray-900 border-t border-primary-100 dark:border-gray-800">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <SectionLabel label="Tin tức" colorClass="bg-primary-400 text-primary-600 dark:text-primary-400" />
            <h2 className="mt-1 text-2xl font-bold text-primary-900 dark:text-white">
              Sự kiện &amp; Bài viết mới nhất
            </h2>
          </div>
          <Link
            href="/blog"
            className="mt-1 hidden shrink-0 items-center gap-1 rounded-full bg-primary-900 px-5 py-2 text-sm font-bold text-white shadow-sm sm:flex dark:bg-primary-700"
          >
            Tất cả →
          </Link>
        </div>
        <Main posts={posts.slice(0, 3)} />
      </section>
    </div>
  )
}