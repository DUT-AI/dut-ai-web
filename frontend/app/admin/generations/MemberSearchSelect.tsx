'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown, Search, User, X } from 'lucide-react'
import type { Member } from '@/lib/db/features/users/types'

interface MemberSearchSelectProps {
  selectedUserId: number
  users: Member[]
  onSelect: (userId: number) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

export default function MemberSearchSelect({
  selectedUserId,
  users,
  onSelect,
  disabled = false,
  className = '',
  placeholder = 'Chọn thành viên...',
}: MemberSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId]
  )

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users
    const query = removeVietnameseTones(searchQuery)
    return users.filter((u) => {
      const nameMatch = removeVietnameseTones(u.name || '').includes(query)
      const emailMatch = (u.email || '').toLowerCase().includes(query)
      const roleMatch = removeVietnameseTones(u.role_name || '').includes(query)
      const idMatch = String(u.id).includes(query)
      return nameMatch || emailMatch || roleMatch || idMatch
    })
  }, [users, searchQuery])

  // Reset active index when search changes
  useEffect(() => {
    setActiveIndex(0)
  }, [searchQuery])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex, isOpen])

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < filteredUsers.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredUsers.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredUsers[activeIndex]) {
          onSelect(filteredUsers[activeIndex].id)
          setIsOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-left text-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:focus:border-blue-400"
      >
        <div className="flex min-w-0 items-center gap-2">
          {selectedUser ? (
            <>
              {selectedUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.name}
                  className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : <User className="h-3 w-3" />}
                </div>
              )}
              <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                {selectedUser.name}
              </span>
              {selectedUser.status !== 'active' && (
                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  OFF
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full min-w-[260px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-0 zoom-in-95 dark:border-slate-800 dark:bg-slate-900">
          {/* Search Header */}
          <div className="relative mb-2 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm theo tên, email, chức vụ..."
              className="h-9 w-full rounded-xl bg-slate-100 pr-8 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Member Options List */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-56 overflow-y-auto overflow-x-hidden space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
          >
            {filteredUsers.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Không tìm thấy thành viên phù hợp
              </li>
            ) : (
              filteredUsers.map((user, index) => {
                const isSelected = user.id === selectedUserId
                const isActiveOption = index === activeIndex

                return (
                  <li
                    key={user.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(user.id)
                      setIsOpen(false)
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-colors ${
                      isActiveOption
                        ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-100'
                        : isSelected
                          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-white'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3 w-3" />}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{user.name}</p>
                        {(user.role_name || user.email) && (
                          <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                            {user.role_name || user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Off'}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
