'use client'

import { useState, useRef } from 'react'
import type { Project, Member } from 'app/api-client'

import ThumbCarousel from './components/ThumbCarousel'
import FeaturedDetail from './components/FeaturedDetail'
import CategoryTabs, { type TabKey } from './components/CategoryTabs'
import FeaturesPanel from './components/FeaturesPanel'
import DemoPanel from './components/DemoPanel'
import TechStackPanel from './components/TechStackPanel'
import TeamPanel from './components/TeamPanel'

export default function ProjectsClient({
  projects,
  members,
}: {
  projects: Project[]
  members: Member[]
}) {
  const [selected, setSelected] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('features')
  const current = projects[selected]

  /* ── Panel transition state ── */
  const [visible, setVisible] = useState(true)
  const prevTab = useRef<TabKey>(activeTab)

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) return
    setVisible(false)                       // fade-out current panel
    setTimeout(() => {
      prevTab.current = tab
      setActiveTab(tab)                     // swap content
      setVisible(true)                      // fade-in new panel
    }, 200)                                 // matches CSS transition duration
  }

  if (!current) return null

  return (
    <div className="mx-auto max-w-[1220px] space-y-8 px-6 pb-20 md:px-8">
      {/* 1 — Thumbnail carousel + pagination */}
      <ThumbCarousel projects={projects} selected={selected} onSelect={setSelected} />

      {/* 2 — Featured project detail (two-column) */}
      <FeaturedDetail project={current} members={members} />

      {/* 3 — Category tab pills */}
      <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 4 — Active panel with fade transition */}
      <div
        className="transition-all duration-200 ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        {activeTab === 'features' && <FeaturesPanel project={current} />}
        {activeTab === 'demo' && (
          <DemoPanel
            project={current}
            members={members}
            projects={projects}
            selected={selected}
          />
        )}
        {activeTab === 'tech' && <TechStackPanel project={current} />}
        {activeTab === 'team' && <TeamPanel members={members} />}
      </div>
    </div>
  )
}
