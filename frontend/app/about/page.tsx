import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { genPageMetadata } from 'app/seo'
import Image from 'next/image'
import Link from '@/components/Link'
import { Suspense } from 'react'
import MembersGrid from '@/components/MembersGrid'
import type React from 'react'

export const metadata = genPageMetadata({
  title: 'Về chúng mình | DUT AI Club',
  description:
    'Gặp gỡ đội ngũ DUT AI Club — Ban chủ nhiệm, Leaders và các thành viên của câu lạc bộ AI tại Đại học Bách khoa Đà Nẵng.',
  keywords: [
    'Ban chủ nhiệm DUT AI',
    'đội ngũ AI club',
    'thành viên DUT AI Club',
    'developer AI sinh viên Đà Nẵng',
  ],
})

// ── Static data ──────────────────────────────────────────────────────────────

const LEADER_SLUGS = ['sparrowhawk', 'dev-be']

const ACTIVITIES = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
    title: 'Workshops',
    desc: 'Chuỗi buổi học thực hành từ cơ bản đến nâng cao về AI, ML và Data Science.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
    title: 'Projects',
    desc: 'Triển khai các dự án thực tế ứng dụng AI vào giải quyết bài toán cuộc sống.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400',
    title: 'Hackathons',
    desc: 'Thi đua sáng tạo, xây dựng sản phẩm AI trong thời gian ngắn cùng đồng đội.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-400',
    title: 'Seminars',
    desc: 'Giao lưu, chia sẻ kiến thức với các chuyên gia và nhà nghiên cứu AI hàng đầu.',
  },
]

const CORE_VALUES = [
  { label: '#Sáng tạo', cls: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' },
  { label: '#Hợp tác', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { label: '#Phát triển', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { label: '#Tác động', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

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

type BadgeColor = 'rose' | 'primary' | 'purple' | 'amber'

const BADGE_CLS: Record<BadgeColor, string> = {
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
}

const ICON_BTN_CLS: Record<BadgeColor, string> = {
  rose: 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-gray-700 dark:text-rose-300 dark:hover:bg-gray-600',
  primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-300 dark:hover:bg-gray-600',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-gray-700 dark:text-purple-300 dark:hover:bg-gray-600',
  amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-gray-700 dark:text-amber-300 dark:hover:bg-gray-600',
}

function ProfileCard({
  author,
  badge,
  color = 'primary',
  compact = false,
}: {
  author: Authors
  badge: string
  color?: BadgeColor
  compact?: boolean
}) {
  const { name, avatar, occupation, company, email, github, linkedin } = author
  const socials = [
    email && { href: `mailto:${email}`, icon: SOCIAL_ICONS.email, label: 'Email' },
    github && { href: github, icon: SOCIAL_ICONS.github, label: 'GitHub' },
    linkedin && { href: linkedin, icon: SOCIAL_ICONS.linkedin, label: 'LinkedIn' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[]

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-center pb-0 pt-8">
        <div
          className={`relative overflow-hidden rounded-full border-4 border-primary-50 shadow-md dark:border-gray-700 ${compact ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-100 text-3xl dark:bg-primary-900/30">
              👤
            </div>
          )}
        </div>
        <span className={`mt-4 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest ${BADGE_CLS[color]}`}>
          {badge}
        </span>
        <h3 className={`mt-2 font-extrabold text-primary-900 dark:text-white ${compact ? 'text-base' : 'text-lg'}`}>
          {name}
        </h3>
        {occupation && (
          <p className="mt-0.5 text-xs font-medium text-primary-600 dark:text-gray-400">{occupation}</p>
        )}
        {company && (
          <p className="mb-1 text-[11px] text-gray-400 dark:text-gray-500">{company}</p>
        )}
        <div className="mt-3 flex items-center gap-2 pb-5">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className={`rounded-full p-2 transition-colors ${ICON_BTN_CLS[color]}`}
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-primary-50 px-6 py-5 text-sm dark:border-gray-700">
        <MDXLayoutRenderer code={author.body.code} />
      </div>
    </div>
  )
}

function LeaderCard({
  author,
  badge,
  color = 'primary',
}: {
  author: Authors
  badge: string
  color?: BadgeColor
}) {
  const { name, avatar, occupation, email, github, linkedin } = author
  const socials = [
    email && { href: `mailto:${email}`, icon: SOCIAL_ICONS.email, label: 'Email' },
    github && { href: github, icon: SOCIAL_ICONS.github, label: 'GitHub' },
    linkedin && { href: linkedin, icon: SOCIAL_ICONS.linkedin, label: 'LinkedIn' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[]

  return (
    <div className="flex min-w-[140px] flex-col items-center rounded-2xl border border-primary-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary-50 shadow dark:border-gray-600">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-100 text-2xl dark:bg-primary-900/30">
            👤
          </div>
        )}
      </div>
      <span className={`mt-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${BADGE_CLS[color]}`}>
        {badge}
      </span>
      <h4 className="mt-1.5 text-center text-sm font-bold text-primary-900 dark:text-white">{name}</h4>
      {occupation && (
        <p className="mt-0.5 text-center text-[11px] text-gray-400 dark:text-gray-500">{occupation}</p>
      )}
      <div className="mt-3 flex items-center gap-1.5">
        {socials.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className={`rounded-full p-1.5 transition-colors ${ICON_BTN_CLS[color]}`}
          >
            {s.icon}
          </Link>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-500 dark:text-primary-400">
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
      {children}
    </h2>
  )
}

function MembersGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 animate-pulse dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
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

  // Đội ngũ Leaders
  const leaders = LEADER_SLUGS.map((slug) => allAuthors.find((a) => a.slug === slug)).filter(
    Boolean,
  ) as Authors[]

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 py-24 text-center dark:from-gray-950 dark:via-primary-950 dark:to-primary-900">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-300">
            DUT AI Club
          </p>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
            ABOUT<br />
            <span className="text-primary-300">DUT AI CLUB</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-200/80">
            Nơi hội tụ của những sinh viên đam mê Trí tuệ Nhân tạo tại Đại học Bách khoa Đà Nẵng — cùng nhau học hỏi, sáng tạo và tạo ra tác động thực tiễn.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-6 py-16">

        {/* ── Chúng tôi là ai? / Tại sao? ── */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-extrabold text-gray-900 dark:text-white">Chúng tôi là ai?</h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              DUT AI là Câu lạc bộ Trí tuệ Nhân tạo trực thuộc Trường Đại học Bách khoa — Đại học Đà Nẵng. Chúng mình là cộng đồng của những sinh viên đam mê AI, Machine Learning và Data Science, từ năm nhất đến năm cuối, cùng nhau khám phá và chinh phục thế giới công nghệ đầy tiềm năng.
            </p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-extrabold text-gray-900 dark:text-white">Tại sao chúng tôi tồn tại?</h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Chúng mình tin rằng AI không chỉ là công cụ — đó là chìa khóa để giải quyết những bài toán thực tiễn của xã hội. DUT AI ra đời để tạo ra một môi trường học tập, nghiên cứu và ứng dụng AI sát với thực tế, nơi mọi thành viên đều có thể tỏa sáng theo cách riêng.
            </p>
          </div>
        </section>

        {/* ── Hoạt động tiêu biểu ── */}
        <section>
          <div className="mb-8 text-center">
            <SectionLabel>Những gì chúng mình làm</SectionLabel>
            <SectionTitle>Hoạt động tiêu biểu</SectionTitle>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIVITIES.map((act) => (
              <div
                key={act.title}
                className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${act.color}`}>
                  {act.icon}
                </div>
                <h4 className="mb-2 font-extrabold text-gray-900 dark:text-white">{act.title}</h4>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{act.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tầm nhìn & Sứ mệnh ── */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 dark:border-primary-900/40 dark:from-primary-950 dark:to-gray-800">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-extrabold text-primary-900 dark:text-white">Tầm nhìn</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Trở thành cộng đồng AI sinh viên hàng đầu tại miền Trung — nơi kiến thức, đam mê và ứng dụng thực tế gặp nhau để kiến tạo tương lai. Chúng mình hướng tới việc đưa DUT AI vươn ra tầm quốc gia và kết nối với mạng lưới AI toàn cầu.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-gray-800">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-extrabold text-gray-900 dark:text-white">Sứ mệnh</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Kết nối — Phát triển — Chia sẻ. Chúng mình xây dựng môi trường giao lưu cho sinh viên yêu thích AI/ML, hỗ trợ nghiên cứu dự án thực tế, tổ chức các buổi Workshop chuyên sâu và lan tỏa kiến thức AI đến cộng đồng rộng lớn hơn.
            </p>
          </div>
        </section>

        {/* ── Giá trị cốt lõi ── */}
        <section className="rounded-3xl border border-gray-100 bg-white px-8 py-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <SectionLabel>Những điều chúng mình trân trọng</SectionLabel>
          <SectionTitle>Giá trị cốt lõi</SectionTitle>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {CORE_VALUES.map((v) => (
              <span
                key={v.label}
                className={`rounded-full px-6 py-2.5 text-sm font-bold tracking-wide ${v.cls}`}
              >
                {v.label}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Chúng mình đề cao tinh thần <strong className="text-gray-700 dark:text-gray-200">Integrity</strong> và câu châm ngôn{' '}
            <em className="text-primary-600 dark:text-primary-400">"Dreams Never Need Half Hearts"</em>.
          </p>
        </section>

        {/* ── Ban chủ nhiệm ── */}
        <section>
          <div className="mb-8">
            <SectionLabel>Lãnh đạo câu lạc bộ</SectionLabel>
            <SectionTitle>Ban chủ nhiệm</SectionTitle>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {president && <ProfileCard author={president} badge="Chủ nhiệm" color="rose" compact />}
            {pctHocthu && <ProfileCard author={pctHocthu} badge="P. Học thuật" color="primary" compact />}
            {pctSkien && <ProfileCard author={pctSkien} badge="P. Sự kiện" color="amber" compact />}
          </div>
        </section>

        {/* ── Đội ngũ Leaders ── */}
        {/* {leaders.length > 0 && (
          <section>
            <div className="mb-8">
              <SectionLabel>Đội ngũ kỹ thuật &amp; chuyên môn</SectionLabel>
              <SectionTitle>Đội ngũ Leaders</SectionTitle>
            </div>
            <div className="flex flex-wrap gap-4">
              {leaders.map((leader, i) => (
                <LeaderCard
                  key={leader.slug}
                  author={leader}
                  badge={i === 0 ? 'FE Developer' : i === 1 ? 'BE Developer' : 'Leader'}
                  color={i % 2 === 0 ? 'primary' : 'purple'}
                />
              ))}
            </div>
          </section>
        )} */}

        {/* ── Thành viên (dynamic) ── */}
        <section>
          <div className="mb-8">
            <SectionLabel>Những người tạo nên DUT AI</SectionLabel>
            <SectionTitle>Thành viên</SectionTitle>
          </div>
          <Suspense fallback={<MembersGridSkeleton />}>
            <MembersGrid />
          </Suspense>
        </section>

      </div>
    </div>
  )
}
