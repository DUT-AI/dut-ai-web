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
  { href: '/admin/generations', label: 'Album thế hệ', icon: Users },
  { href: '/admin/keywords', label: 'Từ khóa (SEO)', icon: Tag },
  { href: '/admin/introductions', label: 'Giới thiệu (Intro)', icon: Info },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    name: string
    email: string
    avatar?: string
    roles?: string[]
  } | null>(null)

  React.useEffect(() => {
    // 1. Đọc cookie trước để có data ngay lập tức
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/dut_admin_user=([^;]+)/)
      if (match && match[1]) {
        try {
          const user = JSON.parse(decodeURIComponent(match[1]))
          setCurrentUser(user)
        } catch {}
      }
    }

    // 2. Gọi API /api/auth/me để cập nhật dữ liệu mới nhất từ server
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.is_success && resData?.data) {
          setCurrentUser(resData.data)
        }
      })
      .catch(() => {})
  }, [pathname])

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
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 dark:border-white/10 dark:bg-slate-900/90',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-6 dark:border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-md">
              AI
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white">DUT AI</span>
              <span className="ml-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)

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
                <Icon
                  className={cn(
                    'h-5 w-5',
                    active ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="space-y-2 border-t border-slate-200/80 p-4 dark:border-white/10">
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
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
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
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Bảng quản trị hệ thống DUT AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-slate-50 py-1 pr-3 pl-1.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-6 w-6 rounded-full border border-blue-500 object-cover"
                />
              ) : (
                <span className="ml-1.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              )}
              <div className="flex flex-col text-left">
                <span className="text-xs leading-none">
                  {currentUser?.name || currentUser?.email || 'User'}
                </span>
                {currentUser?.roles && currentUser.roles.length > 0 && (
                  <div className="mt-0.5 flex items-center gap-1">
                    {currentUser.roles.map((r, i) => (
                      <span
                        key={i}
                        className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[10px] leading-tight font-semibold text-blue-600 dark:text-blue-400"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
