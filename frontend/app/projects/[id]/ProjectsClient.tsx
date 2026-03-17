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
  project,
  members,
}: {
  project: Project
  members: Member[]
}) {
  const projects = [project]
  const [selected, setSelected] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('features')
  const current = projects[selected]

  const projectMembers: Member[] = project.members?.map((member) => ({
    id: member.id,
    name: member.user_name || 'Member',
    role_name: member.role || 'Member',
    avatar_url: member.user_avatar_url || undefined,
  })) || []

  const effectiveMembers = projectMembers.length > 0 ? projectMembers : members

  const groupedMembers = effectiveMembers.reduce((acc, m) => {
    const role = m.role_name || 'Khác'
    if (!acc[role]) acc[role] = []
    acc[role].push(m)
    return acc
  }, {} as Record<string, Member[]>)

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
      <FeaturedDetail project={current} members={effectiveMembers} />

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
            members={effectiveMembers}
            projects={projects}
            selected={selected}
          />
        )}
        {activeTab === 'tech' && <TechStackPanel project={current} />}
        {activeTab === 'team' && <TeamPanel members={groupedMembers} />}
      </div>
    </div>
  )
}
