'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Github,
  Linkedin,
  Facebook,
  Globe,
  FileText,
  Briefcase,
  Sparkles,
} from 'lucide-react'

export interface PortfolioHeroProps {
  name: string
  headline?: string | null
  quote?: string | null
  avatarUrl?: string | null
  cvUrl?: string | null
  clubRole?: string | null
  socialLinks: {
    github?: string | null
    linkedin?: string | null
    facebook?: string | null
    website?: string | null
  }
}

export default function PortfolioHero({
  name,
  headline,
  quote,
  avatarUrl,
  cvUrl,
  clubRole,
  socialLinks,
}: PortfolioHeroProps) {
  const defaultAvatar = '/static/images/avatar.png'

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-b from-blue-50/50 via-white to-white p-8 dark:border-gray-800 dark:from-blue-950/20 dark:via-gray-950 dark:to-gray-950 sm:p-12">
      <div className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row md:items-start">
        {/* Left Information */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {clubRole && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{clubRole}</span>
              <span className="text-blue-300 dark:text-blue-700">•</span>
              <span>DUT AI Club</span>
            </div>
          )}

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Hi, I'm <span className="text-blue-600 dark:text-blue-400">{name}</span>{' '}
            <span className="inline-block origin-[70%_70%] animate-wave">👋</span>
          </h1>

          {headline && (
            <p className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-300 sm:text-xl">
              {headline}
            </p>
          )}

          {quote && (
            <blockquote className="mt-4 border-l-2 border-blue-500 pl-4 text-sm italic text-gray-600 dark:text-gray-400">
              &ldquo;{quote}&rdquo;
            </blockquote>
          )}

          {/* Social Links Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white"
                aria-label="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-900 dark:hover:text-blue-400"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-900 dark:hover:text-blue-400"
                aria-label="Facebook Profile"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-teal-900 dark:hover:text-teal-400"
                aria-label="Personal Website"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            {cvUrl && (
              <a
                href="#cv"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <FileText className="h-4 w-4" />
                Xem CV / Resume
              </a>
            )}
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Briefcase className="h-4 w-4" />
              Dự án tham gia
            </a>
          </div>
        </div>

        {/* Right Avatar */}
        <div className="relative flex-shrink-0">
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-gray-900 sm:h-44 sm:w-44">
            <Image
              src={avatarUrl || defaultAvatar}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 144px, 176px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
