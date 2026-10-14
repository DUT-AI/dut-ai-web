'use client'

import React, { useState } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { BlogKeyword } from '@/lib/db/features/keywords/types'
import { createKeywordInlineAction } from '../actions'

interface BlogKeywordsSectionProps {
  keywords: BlogKeyword[]
  selectedKeywords: number[]
  onToggleKeyword: (keywordId: number) => void
}

export default function BlogKeywordsSection({
  keywords,
  selectedKeywords,
  onToggleKeyword,
}: BlogKeywordsSectionProps) {
  const [keywordList, setKeywordList] = useState<BlogKeyword[]>(keywords)
  const [keywordSearch, setKeywordSearch] = useState('')
  const [isCreatingKeyword, setIsCreatingKeyword] = useState(false)

  const filteredKeywords = keywordList.filter((k) =>
    k.keyword_name.toLowerCase().includes(keywordSearch.toLowerCase().trim())
  )

  const cleanKeywordSearch = keywordSearch.trim()
  const hasExactKeywordMatch = keywordList.some(
    (k) => k.keyword_name.toLowerCase() === cleanKeywordSearch.toLowerCase()
  )

  const handleCreateKeyword = async () => {
    if (!cleanKeywordSearch || isCreatingKeyword) return

    // If an exact match already exists in the list, just toggle/select it
    const existing = keywordList.find(
      (k) => k.keyword_name.toLowerCase() === cleanKeywordSearch.toLowerCase()
    )
    if (existing) {
      if (!selectedKeywords.includes(existing.id)) {
        onToggleKeyword(existing.id)
        toast.info(`Đã chọn từ khóa có sẵn "${existing.keyword_name}"`)
      }
      setKeywordSearch('')
      return
    }

    setIsCreatingKeyword(true)
    try {
      const res = await createKeywordInlineAction(cleanKeywordSearch)
      if (res?.error) {
        toast.error(res.error)
        return
      }
      if (res?.data) {
        const newKw = res.data
        setKeywordList((prev) => [newKw, ...prev])
        if (!selectedKeywords.includes(newKw.id)) {
          onToggleKeyword(newKw.id)
        }
        setKeywordSearch('')
        toast.success(`Đã tạo và chọn từ khóa "${newKw.keyword_name}"`)
      }
    } catch {
      toast.error('Có lỗi xảy ra khi tạo từ khóa mới.')
    } finally {
      setIsCreatingKeyword(false)
    }
  }

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
            Từ khóa & Thẻ SEO ({selectedKeywords.length} đã chọn)
          </label>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Gắn thẻ phân loại bài viết.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm hoặc gõ để tạo từ khóa mới..."
          value={keywordSearch}
          onChange={(e) => setKeywordSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
              if (cleanKeywordSearch) {
                handleCreateKeyword()
              }
            }
          }}
          className="focus:ring-primary-500 w-full rounded-xl border border-slate-200 bg-white py-1.5 pr-20 pl-9 text-xs focus:ring-1 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
        />
        {cleanKeywordSearch && !hasExactKeywordMatch && (
          <button
            type="button"
            onClick={handleCreateKeyword}
            disabled={isCreatingKeyword}
            className="absolute top-1/2 right-2 -translate-y-1/2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition-all disabled:opacity-50"
            title={`Tạo từ khóa "${cleanKeywordSearch}"`}
          >
            {isCreatingKeyword ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
            <span>Tạo mới</span>
          </button>
        )}
      </div>

      <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
        {/* If typing a new keyword that doesn't exist, show quick create pill */}
        {cleanKeywordSearch && !hasExactKeywordMatch && (
          <button
            type="button"
            onClick={handleCreateKeyword}
            disabled={isCreatingKeyword}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-emerald-500/60 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs transition-all hover:bg-emerald-100 hover:border-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            {isCreatingKeyword ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>Tạo thẻ "#{cleanKeywordSearch}"</span>
            <kbd className="ml-1 rounded bg-emerald-200/70 px-1 py-0.5 font-mono text-[9px] dark:bg-emerald-900/70">
              Enter
            </kbd>
          </button>
        )}

        {filteredKeywords.length === 0 && (!cleanKeywordSearch || hasExactKeywordMatch) ? (
          <span className="p-2 text-xs text-slate-400 italic">Không tìm thấy từ khóa</span>
        ) : (
          filteredKeywords.map((kw) => {
            const selected = selectedKeywords.includes(kw.id)
            return (
              <button
                type="button"
                key={kw.id}
                onClick={() => onToggleKeyword(kw.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  selected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {selected ? '✓ ' : '# '}
                {kw.keyword_name}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
