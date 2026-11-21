'use client'

import React from 'react'
import Image from 'next/image'
import TechIcon from './TechIcons'
import PortfolioGithubCalendar from './GithubCalendar'
import type { SkillCategory } from '@/features/users/db/types'

export interface PortfolioAboutProps {
  name: string
  bio?: string | null
  quote?: string | null
  clubRole?: string | null
  skills: SkillCategory[]
  githubUsername?: string | null
}

export default function PortfolioAbout({
  name,
  bio,
  quote,
  clubRole,
  skills,
  githubUsername,
}: PortfolioAboutProps) {
  // Partition skills into:
  // 1. Techstack (Programming languages, frameworks, core techs)
  // 2. Toolstack (IDEs, Tools, Platforms)
  const toolKeywords = ['tool', 'tools', 'công cụ', 'ide', 'platform', 'os', 'devops']

  const techItems: string[] = []
  const toolItems: string[] = []

  skills.forEach((cat) => {
    const isToolCat = toolKeywords.some((kw) => cat.category.toLowerCase().includes(kw))
    if (isToolCat) {
      toolItems.push(...cat.items)
    } else {
      techItems.push(...cat.items)
    }
  })

  // Fallback defaults if database has few items
  const finalTechstack =
    techItems.length > 0
      ? Array.from(new Set(techItems))
      : [
          'Python',
          'TypeScript',
          'JavaScript',
          'React',
          'Next.js',
          'Node.js',
          'PostgreSQL',
          'Docker',
          'Git',
        ]

  const finalToolstack =
    toolItems.length > 0
      ? Array.from(new Set(toolItems))
      : ['VS Code', 'Postman', 'Slack', 'Vercel', 'Linux', 'MacOS', 'Figma']

  return (
    <div className="relative z-10 py-12">
      {/* 1. "KNOW WHO I'M" (AboutCard from my-cv) */}
      <section className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">
        {/* Left: Bio Quote Card */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Know Who <span className="text-blue-500">I'M</span>
          </h2>

          <div className="mt-6 rounded-2xl border border-blue-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <blockquote className="space-y-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              <p>
                Hi Everyone, I am <span className="font-bold text-blue-400">{name}</span>
                {clubRole && (
                  <span>
                    , serving as <span className="text-blue-400">{clubRole}</span> at{' '}
                    <span className="font-semibold text-white">DUT AI Club</span>
                  </span>
                )}
                .
              </p>

              {bio ? (
                <p className="whitespace-pre-line text-slate-300">{bio}</p>
              ) : (
                <p>
                  Passionate about software craftsmanship, building scalable full-stack web
                  architectures, and experimenting with cutting-edge artificial intelligence
                  systems. Always eager to collaborate with talented engineers and turn innovative
                  ideas into practical products.
                </p>
              )}

              {quote && (
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <p className="text-base text-blue-400 italic">&ldquo;{quote}&rdquo;</p>
                  <footer className="mt-1 text-xs text-slate-500">— {name}</footer>
                </div>
              )}
            </blockquote>
          </div>
        </div>

        {/* Right: About Illustration */}
        <div className="flex flex-shrink-0 items-center justify-center">
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            <Image
              src="/static/images/my-cv-about.png"
              alt="About illustration"
              fill
              className="object-contain drop-shadow-[0_15px_30px_rgba(37,99,235,0.25)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. PROFESSIONAL SKILLSET (Techstack from my-cv) */}
      <section className="mt-20">
        <h3 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Professional <span className="text-blue-500">Skillset</span>
        </h3>
        <p className="mt-2 text-center text-sm text-slate-400">
          Core programming languages, frameworks, and technologies
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          {finalTechstack.map((tech, i) => (
            <TechIcon key={i} name={tech} className="w-[140px] sm:w-[170px] md:w-[190px]" />
          ))}
        </div>
      </section>

      {/* 3. TOOLS I USE (Toolstack from my-cv) */}
      <section className="mt-20">
        <h3 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="text-blue-500">Tools</span> I Use
        </h3>
        <p className="mt-2 text-center text-sm text-slate-400">
          Software, development environments, and productivity suites
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          {finalToolstack.map((tool, i) => (
            <TechIcon key={i} name={tool} className="w-[140px] sm:w-[170px] md:w-[190px]" />
          ))}
        </div>
      </section>

      {/* 4. DAYS I CODE (GitHub Activity Calendar) */}
      <PortfolioGithubCalendar username={githubUsername} />
    </div>
  )
}
