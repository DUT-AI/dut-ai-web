import { Authors, allAuthors } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import Image from 'next/image'
import Link from '@/components/Link'
import { Suspense } from 'react'
import MembersGrid from '@/components/MembersGrid'
import type React from 'react'
import Footer from '@/components/Footer'

export const metadata = genPageMetadata({
  title: 'Về chúng mình | DUT AI Club',
  description:
    'Gặp gỡ đội ngũ DUT AI Club — Ban chủ nhiệm, Leaders và các thành viên của câu lạc bộ AI tại Đại học Bách khoa Đà Nẵng.',
})

// ── Static data ──────────────────────────────────────────────────────────────

const ACTIVITIES = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    emoji: '📚',
    title: 'Workshops',
    desc: 'Chuỗi buổi học thực hành từ cơ bản đến nâng cao về AI, ML và Data Science.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    emoji: '💻',
    title: 'Projects',
    desc: 'Triển khai các dự án thực tế ứng dụng AI vào giải quyết bài toán cuộc sống.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    emoji: '⚡',
    title: 'Hackathons',
    desc: 'Thi đua sáng tạo, xây dựng sản phẩm AI trong thời gian ngắn cùng đồng đội.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    emoji: '🔬',
    title: 'Research',
    desc: 'Nghiên cứu các chủ đề AI tiên tiến và công bố kết quả trong cộng đồng.',
  },
]

const CORE_VALUES = [
  { label: '#Sáng tạo' },
  { label: '#Hợp tác' },
  { label: '#Phát triển' },
  { label: '#Tác động' },
]

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  email: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
}

// ── Glass card style helpers ──────────────────────────────────────────────────

// These are now CSS classes — see the <style> tag in the component
const glassCard = {} as React.CSSProperties
const glassCardLight = {} as React.CSSProperties

// ── Sub-components ────────────────────────────────────────────────────────────

function LeadershipCard({
  author,
  badge,
}: {
  author: Authors
  badge: string
}) {
  const { name, avatar, occupation, email, github, linkedin } = author
  const socials = [
    email && { href: `mailto:${email}`, icon: SOCIAL_ICONS.email, label: 'Email' },
    github && { href: github, icon: SOCIAL_ICONS.github, label: 'GitHub' },
    linkedin && { href: linkedin, icon: SOCIAL_ICONS.linkedin, label: 'LinkedIn' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[]

  return (
    <div
      className="glass-card-light flex flex-col items-center rounded-3xl p-7 text-center transition-all hover:scale-[1.02]"
    >
      {/* Avatar */}
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-indigo-200/40 dark:border-white/30 shadow-xl">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-100/60 dark:bg-white/20 text-3xl">👤</div>
        )}
      </div>
      {/* Name */}
      <h3 className="mb-1 text-base font-extrabold text-slate-800 dark:text-white">{name}</h3>
      {/* Badge */}
      <span
        className="mb-2 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 dark:text-white/90"
        style={{ background: 'rgba(100,80,200,0.12)', border: '1px solid rgba(100,80,200,0.2)' }}
      >
        {badge}
      </span>
      {occupation && (
        <p className="mb-3 text-xs text-slate-500 dark:text-white/60">{occupation}</p>
      )}
      {/* Socials */}
      {socials.length > 0 && (
        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="rounded-full p-1.5 text-slate-500 dark:text-white/70 transition-all hover:bg-indigo-100/60 dark:hover:bg-white/20 hover:text-indigo-700 dark:hover:text-white"
            >
              {s.icon}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MembersGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="member-skeleton flex flex-col items-center gap-2 rounded-2xl p-4 animate-pulse"
        >
          <div className="h-14 w-14 rounded-full bg-indigo-200/40 dark:bg-white/20" />
          <div className="h-2.5 w-16 rounded bg-indigo-200/50 dark:bg-white/20" />
          <div className="h-2 w-12 rounded bg-indigo-100/50 dark:bg-white/10" />
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  // Ban chủ nhiệm
  const president = allAuthors.find((p) => p.slug === 'default') as Authors
  const pctHocthu = allAuthors.find((p) => p.slug === 'pct-hocthu') as Authors
  const pctSkien = allAuthors.find((p) => p.slug === 'pct-skien') as Authors

  return (
    <div className="about-page min-h-screen pb-16">
      <style>{`
        .about-page {
          background: #f8fafc;
        }
        .dark .about-page {
          background: #020617;
        }
        .glass-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(148,130,252,0.22);
        }
        .dark .glass-card {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
        }
        .glass-card-light {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(148,130,252,0.25);
        }
        .dark .glass-card-light {
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
        }
        .value-tag {
          background: rgba(100,80,200,0.12);
          border: 1px solid rgba(100,80,200,0.22);
          backdrop-filter: blur(8px);
        }
        .dark .value-tag {
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.28);
        }
        .member-skeleton {
          background: rgba(100,80,200,0.08);
          border: 1px solid rgba(100,80,200,0.12);
        }
        .dark .member-skeleton {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .about-blobs { display: none; }
        .dark .about-blobs { display: block; }
      `}</style>
      {/* ── Decorative background blobs (light + dark) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Dark mode blobs */}
        <div className="about-blobs absolute inset-0">
          <div
            className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-0 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
          />
        </div>
        {/* Light mode blobs */}
        <div className="dark:hidden">
          <div className="absolute top-[-80px] left-[10%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
            style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }} />
          <div className="absolute top-[30%] right-[5%] h-[320px] w-[320px] rounded-full opacity-35 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }} />
          <div className="absolute bottom-[10%] left-[20%] h-[280px] w-[280px] rounded-full opacity-30 blur-[70px]"
            style={{ background: 'radial-gradient(circle, #bae6fd 0%, transparent 70%)' }} />
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative px-6 pt-44 pb-20 text-center md:px-12">
        <div className="relative mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/50">
            ✦ Câu chuyện của chúng mình ✦
          </p>

          {/* Main title */}
          <h1
            className="mb-6 font-black uppercase leading-none text-white"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5rem)',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            ABOUT
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #7C3AED 0%, #C026D3 50%, #E879F9 100%)' }}
            >DUT AI CLUB</span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-white/65">
            Nơi hội tụ của những sinh viên đam mê Trí tuệ Nhân tạo — chúng mình học hỏi, sáng tạo và lan toả sức mạnh của Trí tuệ Nhân tạo.
          </p>
        </div>
      </section>

      <div className="relative mx-auto max-w-5xl space-y-16 px-6 md:px-12">

        {/* ── Chúng tôi là ai? / Tại sao tồn tại? ── */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-8 transition-all hover:scale-[1.01]">
            <div
              className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ background: 'rgba(192,132,252,0.3)', border: '1px solid rgba(192,132,252,0.4)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">Chúng tôi là ai?</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65">
              DUT AI là Câu lạc bộ trực thuộc Trường Đại học Bách khoa — ĐHĐN. Chúng tôi tập hợp những sinh viên đam mê AI từ các khóa, cùng nhau khám phá và ứng dụng AI để giải quyết các vấn đề thực trong cuộc sống.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-8 transition-all hover:scale-[1.01]">
            <div
              className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ background: 'rgba(244,114,182,0.3)', border: '1px solid rgba(244,114,182,0.4)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">Tại sao chúng tôi tồn tại?</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65">
              Chúng tôi tin rằng AI không chỉ là công cụ mà là chìa khoá giải quyết những bài toán thực tiễn của xã hội. Chúng tôi tạo ra môi trường học tập, nghiên cứu và ứng dụng AI sát với thực tế, nơi thành viên đều có thể tỏa sáng theo cách riêng.
            </p>
          </div>
        </section>

        {/* ── Hoạt động tiêu biểu ── */}
        <section>
          <div className="mb-10 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-white/50">
              Những gì chúng mình làm
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Hoạt động tiêu biểu</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIVITIES.map((act) => (
              <div
                key={act.title}
                className="glass-card flex flex-col items-center rounded-3xl p-7 text-center transition-all hover:scale-[1.03] hover:shadow-xl"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: 'rgba(100,80,200,0.12)', border: '1px solid rgba(100,80,200,0.2)' }}
                >
                  {act.emoji}
                </div>
                <h4 className="mb-2 font-extrabold text-slate-900 dark:text-white">{act.title}</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-white/60">{act.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tầm nhìn & Sứ mệnh ── */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Tầm nhìn */}
          <div className="glass-card rounded-3xl p-8 transition-all hover:scale-[1.01]">
            <h3 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white">Tầm nhìn</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65">
              Trở thành cộng đồng sinh viên AI hàng đầu miền Trung, nơi kiến thức, đam mê và ứng dụng thực tế gặp nhau để kiến tạo tương lai. Chúng mình hướng tới việc đưa DUT AI vươn ra tầm quốc tế và kết nối với mạng lưới AI toàn cầu.
            </p>
          </div>
          {/* Sứ mệnh */}
          <div className="rounded-3xl p-8 transition-all hover:scale-[1.01] glass-card">
            <h3 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white">Sứ mệnh</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65">
              Xây dựng môi trường học tập hiện đại, kết nối sinh viên với doanh nghiệp, và thúc đẩy ứng dụng AI vì sự phát triển của cộng đồng. Kết nối — Phát triển — Chia sẻ là slogan cốt lõi của chúng mình.
            </p>
          </div>
        </section>

        {/* ── Giá trị cốt lõi ── */}
        <section className="glass-card rounded-3xl px-8 py-12 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-white/50">
            Những điều chúng mình trân trọng
          </p>
          <h2 className="mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">Giá trị cốt lõi</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CORE_VALUES.map((v) => (
              <span
                key={v.label}
                className="value-tag rounded-full px-6 py-2.5 text-sm font-bold tracking-wide text-slate-700 dark:text-white transition-all hover:scale-105"
              >
                {v.label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Ban chủ nhiệm ── */}
        <section>
          <div className="mb-10 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-white/50">
              Lãnh đạo câu lạc bộ
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Ban chủ nhiệm</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {president && <LeadershipCard author={president} badge="Chủ nhiệm" />}
            {pctHocthu && <LeadershipCard author={pctHocthu} badge="PCT. Học thuật" />}
            {pctSkien && <LeadershipCard author={pctSkien} badge="PCT. Sự kiện" />}
          </div>
        </section>

        {/* ── Thành viên (dynamic) ── */}
        <section>
          <div className="mb-10 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-white/50">
              Những người tạo nên DUT AI
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Thành viên</h2>
          </div>
          <Suspense fallback={<MembersGridSkeleton />}>
            <MembersGrid />
          </Suspense>
        </section>

        <Footer />
      </div>
    </div>
  )
}
