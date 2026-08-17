'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Calendar,
  Image as ImageIcon,
  Users,
  Tag,
  Info,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import ThemeSwitch from '@/components/ThemeSwitch'
import { logoutAdminAction } from './actions'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { href: '/admin/blogs', label: 'Bài viết (Blogs)', icon: FileText },
  { href: '/admin/projects', label: 'Dự án (Projects)', icon: Briefcase },
  { href: '/admin/events', label: 'Sự kiện (Events)', icon: Calendar },
  { href: '/admin/posts', label: 'Khoảnh khắc (Moments)', icon: ImageIcon },
  { href: '/admin/users', label: 'Thành viên (Users)', icon: Users },
  { href: '/admin/keywords', label: 'Từ khóa (SEO)', icon: Tag },
  { href: '/admin/introductions', label: 'Giới thiệu (Intro)', icon: Info },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900/90 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80 dark:border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-md">
              AI
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white">DUT AI</span>
              <span className="ml-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-slate-400 dark:text-slate-500')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <span>Xem trang Public Web</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Bảng quản trị hệ thống DUT AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Online</span>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
