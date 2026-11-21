'use client'

import React from 'react'

export default function MLOpsVisual() {
  return (
    <div className="w-full rounded-2xl border border-emerald-100 bg-white p-4 text-left shadow-[0_10px_30px_rgb(0,0,0,0.05)] dark:border-emerald-900/40 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          CI/CD & Deployment
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Kubernetes Live
        </span>
      </div>

      {/* Pipeline Steps */}
      <div className="mb-3 grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✓ Build
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✓ Test
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✓ Triton
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          Monitor
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Latency: <strong className="font-mono text-gray-800 dark:text-gray-200">14ms</strong>
        </span>
        <span>
          Drift Score:{' '}
          <strong className="font-mono text-emerald-600 dark:text-emerald-400">0.01</strong>
        </span>
      </div>
    </div>
  )
}
