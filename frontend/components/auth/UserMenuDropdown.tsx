'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, LayoutDashboard, UserCircle, LogOut, ChevronDown, Shield } from 'lucide-react'
import { useSsoAuth } from '@/context/SsoAuthContext'

interface UserMenuDropdownProps {
  forceWhite?: boolean
}

export default function UserMenuDropdown({ forceWhite }: UserMenuDropdownProps) {
  const { user, logout, hasAnyRole } = useSsoAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const isManagement = hasAnyRole(['admin', 'manager', 'editor', 'leader'])
  const primaryRole = user.role_names?.[0] || 'Member'

  const buttonStyle = forceWhite
    ? 'text-white hover:bg-white/10'
    : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tài khoản cá nhân"
        aria-expanded={isOpen}
        className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/60 p-1 pr-2.5 transition-colors dark:border-white/10 ${buttonStyle}`}
      >
        {user.avatar_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-7 w-7 rounded-full border border-blue-500/40 object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="hidden max-w-[120px] truncate text-xs font-semibold sm:inline-block">
          {user.name}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl duration-150 dark:border-white/10 dark:bg-slate-900/95">
          {/* User profile snippet */}
          <div className="border-b border-slate-100 px-3.5 py-3 dark:border-white/5">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Shield className="h-2.5 w-2.5" />
                {primaryRole}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-0.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
            {isManagement && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Bảng quản trị (Admin)</span>
              </Link>
            )}

            <Link
              href="/admin/portfolio"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <UserCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Hồ sơ thành viên (Portfolio)</span>
            </Link>
          </div>

          {/* Logout Action */}
          <div className="border-t border-slate-100 pt-1.5 dark:border-white/5">
            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất (DUT-AI SSO)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
