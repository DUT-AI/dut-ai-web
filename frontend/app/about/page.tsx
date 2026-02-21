import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { genPageMetadata } from 'app/seo'
import Image from 'next/image'
import Link from '@/components/Link'
import type React from 'react'

export const metadata = genPageMetadata({
  title: 'Về chúng mình | DUT AI Club',
  description: 'Gặp gỡ đội ngũ sáng lập DUT AI Club — Ban chủ nhiệm và Ban kỹ thuật của câu lạc bộ AI tại Đại học Bách khoa Đà Nẵng.',
  keywords: ['Ban chủ nhiệm DUT AI', 'đội ngũ AI club', 'thành viên DUT AI Club', 'developer AI sinh viên Đà Nẵng'],
})

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

const ICON_CLS: Record<BadgeColor, string> = {
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
      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-0">
        <div className={`relative overflow-hidden rounded-full border-4 border-primary-50 shadow-md dark:border-gray-700 ${compact ? 'h-20 w-20' : 'h-28 w-28'}`}>
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-100 text-3xl dark:bg-primary-900/30">👤</div>
          )}
        </div>
        <span className={`mt-4 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest ${BADGE_CLS[color]}`}>
          {badge}
        </span>
        <h3 className={`mt-2 font-extrabold text-primary-900 dark:text-white ${compact ? 'text-base' : 'text-lg'}`}>{name}</h3>
        {occupation && <p className="mt-0.5 text-xs font-medium text-primary-600 dark:text-gray-400">{occupation}</p>}
        {company && <p className="mb-1 text-[11px] text-gray-400 dark:text-gray-500">{company}</p>}

        {/* Social icons */}
        <div className="mt-3 flex items-center gap-2 pb-5">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className={`rounded-full p-2 transition-colors ${ICON_CLS[color]}`}
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="border-t border-primary-50 px-6 py-5 text-sm dark:border-gray-700">
        <MDXLayoutRenderer code={author.body.code} />
      </div>
    </div>
  )
}

function SectionHeading({ label, sub, color }: { label: string; sub: string; color: BadgeColor }) {
  const barCls: Record<BadgeColor, string> = {
    rose: 'bg-rose-400',
    primary: 'bg-primary-400',
    purple: 'bg-purple-400',
    amber: 'bg-amber-400',
  }
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className={`h-1 w-8 rounded-full ${barCls[color]}`} />
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{sub}</p>
        <h2 className="text-xl font-extrabold text-primary-900 dark:text-white">{label}</h2>
      </div>
    </div>
  )
}

export default function AboutPage() {
  // Ban chủ nhiệm
  const president = allAuthors.find((p) => p.slug === 'default') as Authors
  const pctHocthu = allAuthors.find((p) => p.slug === 'pct-hocthu') as Authors
  const pctSkien = allAuthors.find((p) => p.slug === 'pct-skien') as Authors

  // Ban kỹ thuật
  const devFE = allAuthors.find((p) => p.slug === 'sparrowhawk') as Authors
  const devBE = allAuthors.find((p) => p.slug === 'dev-be') as Authors

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden py-14">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-rose-200 opacity-30 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary-200 opacity-30 blur-3xl dark:opacity-10" />
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
            👥 Đội ngũ DUT AI
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-900 sm:text-5xl dark:text-white">
            Về chúng mình
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-600 dark:text-gray-400">
            DUT AI Club được vận hành bởi những sinh viên đam mê AI tại Đại học Bách khoa Đà Nẵng.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-16 px-6">

        {/* ── Section 1: Ban chủ nhiệm ── */}
        <section>
          <SectionHeading label="Ban chủ nhiệm" sub="Lãnh đạo CLB" color="rose" />
          <div className="grid gap-6 md:grid-cols-3">
            {president && <ProfileCard author={president} badge="Chủ nhiệm" color="rose" compact />}
            {pctHocthu && <ProfileCard author={pctHocthu} badge="P. Học thuật" color="primary" compact />}
            {pctSkien && <ProfileCard author={pctSkien} badge="P. Sự kiện" color="amber" compact />}
          </div>
        </section>

        {/* ── Section 2: Ban kỹ thuật ── */}
        <section>
          <SectionHeading label="Ban kỹ thuật" sub="Website & Systems" color="primary" />
          <div className="grid gap-6 md:grid-cols-2">
            {devFE && <ProfileCard author={devFE} badge="FE Developer" color="primary" />}
            {devBE && <ProfileCard author={devBE} badge="BE Developer" color="purple" />}
          </div>
        </section>

      </div>
    </div>
  )
}
