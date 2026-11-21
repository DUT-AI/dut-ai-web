'use client'

import React from 'react'
import { Home, User, FolderGit2, BookOpen, FileText } from 'lucide-react'

export type PortfolioTab = 'home' | 'about' | 'projects' | 'blogs' | 'resume'

export interface PortfolioNavbarProps {
  activeTab: PortfolioTab
  onTabChange: (tab: PortfolioTab) => void
}

const TABS: { id: PortfolioTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'about', label: 'About', icon: <User className="h-5 w-5" /> },
  { id: 'projects', label: 'Projects', icon: <FolderGit2 className="h-5 w-5" /> },
  { id: 'blogs', label: 'Blogs', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'resume', label: 'Resume', icon: <FileText className="h-5 w-5" /> },
]

export default function PortfolioNavbar({ activeTab, onTabChange }: PortfolioNavbarProps) {
  return (
    <aside
      className="fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col items-center sm:right-6"
      aria-label="Navigation Tabs"
    >
      <nav className="flex flex-col items-center gap-3 rounded-full border border-blue-500/30 bg-[#0c0513]/80 p-2 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all sm:p-2.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 sm:h-12 sm:w-12 ${
                isActive
                  ? 'scale-105 bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-slate-400 hover:scale-105 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {tab.icon}

              {/* Floating Tooltip Label on hover (pops out to the left) */}
              <span className="pointer-events-none absolute top-1/2 right-full mr-3.5 hidden -translate-y-1/2 rounded-lg border border-blue-500/30 bg-slate-950/90 px-3 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-xl backdrop-blur-md transition-opacity group-hover:block">
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
