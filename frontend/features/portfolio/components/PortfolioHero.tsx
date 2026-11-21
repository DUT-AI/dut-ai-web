'use client'

import React from 'react'
import Image from 'next/image'
import Tilt from 'react-parallax-tilt'
import Typewriter from 'typewriter-effect'
import { useIsMounted } from '@/lib/hooks/useIsMounted'
import {
  Github,
  Linkedin,
  Facebook,
  Globe,
  Twitter,
  ArrowRight,
  Sparkles,
  FileText,
  Briefcase,
} from 'lucide-react'
import type { PortfolioTab } from './PortfolioNavbar'
import styles from '../portfolio.module.css'

export interface PortfolioHeroProps {
  name: string
  headline?: string | null
  quote?: string | null
  avatarUrl?: string | null
  bio?: string | null
  clubRole?: string | null
  socialLinks: {
    github?: string | null
    linkedin?: string | null
    facebook?: string | null
    website?: string | null
    twitter?: string | null
  }
  onNavigateTab: (tab: PortfolioTab) => void
}

export default function PortfolioHero({
  name,
  headline,
  quote,
  avatarUrl,
  bio,
  clubRole,
  socialLinks,
  onNavigateTab,
}: PortfolioHeroProps) {
  const mounted = useIsMounted()

  // Words for Typewriter
  const typewriterStrings = [
    clubRole || 'DUT-AI Club Member',
    headline || 'Software Developer',
    'AI & Web Enthusiast',
    'Tech Explorer',
  ].filter(Boolean)

  const defaultAvatar = '/static/images/avatar.png'

  return (
    <div className="relative z-10 flex flex-col gap-24 py-12">
      {/* 1. HERO TOP ROW */}
      <section className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">
        {/* Left Col: Greeting & Typewriter */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>{clubRole || 'Thành viên'}</span>
            <span className="text-blue-600">•</span>
            <span>DUT AI Club</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hi There! <span className={styles.waveEmoji}>👋🏻</span>
          </h1>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-200 sm:text-4xl">
            I'M <span className="text-blue-500">{name}</span>
          </h2>

          {/* Typewriter Banner */}
          <div className="mt-6 flex h-14 items-center text-xl font-bold text-blue-400 sm:text-2xl">
            {mounted ? (
              <Typewriter
                options={{
                  strings: typewriterStrings,
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 75,
                }}
              />
            ) : (
              <span>{headline || 'Software Developer'}</span>
            )}
          </div>

          {headline && (
            <p className="mt-2 max-w-xl text-base text-slate-400 sm:text-lg">{headline}</p>
          )}

          {/* Action Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button
              type="button"
              onClick={() => onNavigateTab('about')}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
            >
              <span>Về bản thân & Kỹ năng</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('projects')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:text-white"
            >
              <Briefcase className="h-4 w-4 text-blue-400" />
              <span>Dự án tham gia</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('resume')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:text-white"
            >
              <FileText className="h-4 w-4 text-blue-400" />
              <span>Xem CV</span>
            </button>
          </div>
        </div>

        {/* Right Col: Hero Illustration */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative h-72 w-72 sm:h-96 sm:w-96">
            <Image
              src="/static/images/my-cv-home-main.svg"
              alt="DUT-AI Member Hero"
              fill
              className="object-contain drop-shadow-[0_15px_35px_rgba(37,99,235,0.25)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. "LET ME INTRODUCE MYSELF" SECTION (Home2 from my-cv) */}
      <section className="rounded-3xl border border-blue-500/20 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
        <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">
          {/* Left: Bio Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              LET ME <span className="text-blue-500">INTRODUCE</span> MYSELF
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              {bio ? (
                <p className="whitespace-pre-line">{bio}</p>
              ) : (
                <>
                  <p>
                    Programming is not just a career —{' '}
                    <b className="text-blue-400">
                      it is a passion and an avenue to create lasting impact.
                    </b>
                  </p>
                  <p>
                    Constantly exploring innovations in{' '}
                    <b className="text-blue-400">Artificial Intelligence, Web & Mobile Systems</b>,
                    striving to solve real-world problems.
                  </p>
                </>
              )}

              {quote && (
                <blockquote className="mt-6 border-l-4 border-blue-500 pl-4 text-base text-slate-400 italic">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              )}
            </div>

            {/* Social Channels in Introduction */}
            <div className="mt-10">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                FIND ME ON
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Feel free to <span className="text-blue-400">connect</span> with me
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-slate-900 text-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-slate-900 text-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-slate-900 text-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-slate-900 text-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-slate-900 text-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    aria-label="Personal Website"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Parallax Tilt Avatar Card */}
          <div className="flex flex-shrink-0 items-center justify-center">
            {mounted ? (
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.05}
                transitionSpeed={1500}
                className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-blue-500/50 shadow-2xl shadow-blue-500/30 sm:h-72 sm:w-72"
              >
                <Image
                  src={avatarUrl || defaultAvatar}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 224px, 288px"
                  priority
                />
              </Tilt>
            ) : (
              <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-blue-500/50 shadow-2xl shadow-blue-500/30 sm:h-72 sm:w-72">
                <Image
                  src={avatarUrl || defaultAvatar}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 224px, 288px"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
