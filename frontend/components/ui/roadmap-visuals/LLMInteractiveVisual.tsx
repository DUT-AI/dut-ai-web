'use client'

import React from 'react'

export default function LLMInteractiveVisual() {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 dark:border-blue-900/40 dark:bg-blue-500/10 dark:text-blue-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          RAG + Vector Search
        </span>
        <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          Tokens/s: 85
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-2.5 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-200">
          <span className="font-bold text-blue-500">Q: </span>
          <span>Tóm tắt kiến trúc Transformer và MoE?</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-sans leading-relaxed text-slate-700 dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-200">
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">Agent: </span>
          Mixture of Experts (MoE) kích hoạt một tập hợp chuyên gia thưa thớt (sparse experts) giúp
          tăng tham số mà vẫn giữ chi phí tính toán cố định...
          <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-blue-500" />
        </div>
      </div>
    </div>
  )
}
