'use client'

import React, { useState } from 'react'

export default function NLPCanvas() {
  const [activeToken, setActiveToken] = useState(1)
  const tokens = ['The', 'neural', 'model', 'understands', 'context']

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left font-mono shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl">
      <div className="mb-3 flex items-center justify-between font-sans">
        <span className="rounded-md border border-cyan-100 bg-cyan-50 px-2 py-0.5 text-xs font-bold text-cyan-600 dark:border-cyan-900/40 dark:bg-cyan-500/10 dark:text-cyan-400">
          Attention Mechanism
        </span>
        <span className="font-mono text-[11px] text-slate-500 dark:text-gray-400">d_model=768</span>
      </div>

      {/* Interactive Token Row */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tokens.map((tok, i) => (
          <button
            key={tok}
            onClick={() => setActiveToken(i)}
            className={`rounded-lg px-2.5 py-1 text-xs transition-all ${
              activeToken === i
                ? 'bg-cyan-500 font-bold text-white shadow-md shadow-cyan-500/30 dark:text-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tok}
          </button>
        ))}
      </div>

      {/* Attention Heatmap Weights */}
      <div className="space-y-1.5 text-[11px]">
        {tokens.map((tok, i) => {
          const diff = Math.abs(activeToken - i)
          const weight = diff === 0 ? 0.95 : diff === 1 ? 0.72 : diff === 2 ? 0.45 : 0.18
          return (
            <div key={tok} className="flex items-center gap-2">
              <span className="w-20 truncate text-right text-slate-600 dark:text-gray-400">
                {tok}:
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${weight * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                {weight.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
