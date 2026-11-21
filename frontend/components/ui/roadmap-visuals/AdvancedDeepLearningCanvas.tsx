'use client'

import React from 'react'

export default function AdvancedDeepLearningCanvas() {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:border-indigo-900/40 dark:bg-indigo-500/10 dark:text-indigo-400">
          Transformer Block (x12)
        </span>
        <span className="font-mono text-[11px] font-semibold text-purple-600 dark:text-purple-400">
          8 Heads
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl border border-indigo-200/80 bg-indigo-50/70 p-2.5 text-xs text-indigo-900 dark:border-indigo-700/60 dark:bg-indigo-950/70 dark:text-indigo-200">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
            Multi-Head Self-Attention
          </span>
          <span className="font-mono text-[10px] font-medium text-slate-500 dark:text-gray-400">
            Q, K, V Proj
          </span>
        </div>
        <div className="w-full py-0.5 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
          ↓ Add & LayerNorm
        </div>
        <div className="flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/70 p-2.5 text-xs text-purple-900 dark:border-purple-700/60 dark:bg-purple-950/70 dark:text-purple-200">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400" />
            Feed Forward Network
          </span>
          <span className="font-mono text-[10px] font-medium text-slate-500 dark:text-gray-400">
            d_ff = 3072
          </span>
        </div>
        <div className="w-full py-0.5 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
          ↓ Add & LayerNorm
        </div>
        <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-2.5 text-xs text-emerald-900 dark:border-emerald-700/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="font-semibold">Vision / Text Output State</span>
          <span className="font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Softmax
          </span>
        </div>
      </div>
    </div>
  )
}
