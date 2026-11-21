'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PortfolioNavbar, { PortfolioTab } from './PortfolioNavbar'
import PortfolioParticles from './PortfolioParticles'
import PortfolioHero from './PortfolioHero'
import PortfolioAbout from './PortfolioAbout'
import PortfolioProjects from './PortfolioProjects'
import PortfolioBlogs from './PortfolioBlogs'
import PortfolioResume from './PortfolioResume'
import type { MemberPortfolioData } from '@/features/users/db/types'
import styles from '../portfolio.module.css'

export interface PortfolioContainerProps {
  profile: MemberPortfolioData
}

export default function PortfolioContainer({ profile }: PortfolioContainerProps) {
  const searchParams = useSearchParams()

  // Derive active tab from searchParams (e.g. ?tab=blogs) or state
  const paramTab = (searchParams.get('tab') as PortfolioTab) || 'home'
  const [selectedTab, setSelectedTab] = useState<PortfolioTab | null>(null)
  const activeTab = selectedTab ?? paramTab

  // Sync tab change to URL search params without full page reload
  const handleTabChange = (newTab: PortfolioTab) => {
    setSelectedTab(newTab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newTab)
    window.history.pushState({}, '', url.toString())
    // Scroll smoothly to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`relative min-h-screen ${styles.cosmosBackground}`}>
      {/* 1. Global Starry Canvas Particles */}
      <PortfolioParticles count={140} />

      {/* 2. Floating Vertical Navigation Bar on the Right */}
      <PortfolioNavbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 3. Main Dynamic Tab Content Container */}
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-300">
            <PortfolioHero
              name={profile.name}
              headline={profile.headline}
              quote={profile.quote}
              avatarUrl={profile.avatarUrl}
              bio={profile.bio}
              clubRole={profile.clubRole}
              socialLinks={profile.socialLinks}
              onNavigateTab={handleTabChange}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-in fade-in duration-300">
            <PortfolioAbout
              name={profile.name}
              bio={profile.bio}
              quote={profile.quote}
              clubRole={profile.clubRole}
              skills={profile.skills}
              githubUsername={profile.socialLinks.github}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-in fade-in duration-300">
            <PortfolioProjects projects={profile.projects} />
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="animate-in fade-in duration-300">
            <PortfolioBlogs blogs={profile.blogs} />
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="animate-in fade-in duration-300">
            <PortfolioResume
              cvUrl={profile.cv?.fileUrl}
              fileName={profile.cv?.fileName}
              fileSize={profile.cv?.fileSize}
            />
          </div>
        )}
      </main>
    </div>
  )
}
