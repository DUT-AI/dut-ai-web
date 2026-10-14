'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import type { Member } from '@/lib/db/features/users/types'

interface BlogAuthorsSectionProps {
  authors: Member[]
  selectedAuthors: number[]
  onToggleAuthor: (authorId: number) => void
}

export default function BlogAuthorsSection({
  authors,
  selectedAuthors,
  onToggleAuthor,
}: BlogAuthorsSectionProps) {
  const [authorSearch, setAuthorSearch] = useState('')

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(authorSearch.toLowerCase().trim())
  )

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
            Tác giả bài viết ({selectedAuthors.length} đã chọn)
          </label>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Chọn một hoặc nhiều thành viên đồng tác giả.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm tác giả..."
          value={authorSearch}
          onChange={(e) => setAuthorSearch(e.target.value)}
          className="focus:ring-primary-500 w-full rounded-xl border border-slate-200 bg-white py-1.5 pr-3 pl-9 text-xs focus:ring-1 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
        />
      </div>

      <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
        {filteredAuthors.length === 0 ? (
          <span className="p-2 text-xs text-slate-400 italic">Không tìm thấy tác giả</span>
        ) : (
          filteredAuthors.map((author) => {
            const selected = selectedAuthors.includes(author.id)
            return (
              <button
                type="button"
                key={author.id}
                onClick={() => onToggleAuthor(author.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  selected
                    ? 'bg-primary-600 ring-primary-500/30 text-white shadow-sm ring-2'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt=""
                    className="h-4 w-4 rounded-full object-cover"
                  />
                ) : null}
                <span>{selected ? '✓ ' : '+ '}</span>
                <span>{author.name}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
