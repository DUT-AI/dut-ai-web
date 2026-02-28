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
  initialProjectId,
}: {
  projects: Project[]
  members: Member[]
  initialProjectId?: number
}) {
  const initialIndex = initialProjectId ? projects.findIndex((p) => p.id === initialProjectId) : 0
  const [selected, setSelected] = useState(initialIndex >= 0 ? initialIndex : 0)
  const [activeTab, setActiveTab] = useState<TabKey>('features')
  const current = projects[selected]

  const MOCK_MEMBERS: Member[] = [
    { id: 101, name: 'Phước Nguyên', role_name: 'Project Manager', avatar_url: 'https://i.pravatar.cc/150?u=1' },
    { id: 102, name: 'Bảo Trâm', role_name: 'Business Analyst', avatar_url: 'https://i.pravatar.cc/150?u=2' },
    { id: 103, name: 'Anh Quân', role_name: 'Designer', avatar_url: 'https://i.pravatar.cc/150?u=3' },
    { id: 104, name: 'Minh Tuấn', role_name: 'Frontend Developer', avatar_url: 'https://i.pravatar.cc/150?u=4' },
    { id: 105, name: 'Hải Đăng', role_name: 'Backend Developer', avatar_url: 'https://i.pravatar.cc/150?u=5' },
    { id: 106, name: 'Hoàng Long', role_name: 'AI Developer', avatar_url: 'https://i.pravatar.cc/150?u=6' },
    { id: 107, name: 'Đức Huy', role_name: 'Frontend Developer', avatar_url: 'https://i.pravatar.cc/150?u=7' },
  ]

  const groupedMembers = MOCK_MEMBERS.reduce((acc, m) => {
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
        {activeTab === 'team' && <TeamPanel members={groupedMembers} />}
      </div>
    </div>
  )
}
