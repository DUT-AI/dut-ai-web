'use client'

import React from 'react'

export default function PythonVisual() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left font-mono text-xs shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl">
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 font-sans text-[11px] font-medium text-slate-500 dark:text-gray-400">
            main.py
          </span>
        </div>
        <span className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:border-blue-900/40 dark:bg-blue-500/20 dark:text-blue-400">
          Python 3.12
        </span>
      </div>
      <div className="space-y-1.5 leading-5 text-slate-800 dark:text-slate-100">
        <p>
          <span className="font-semibold text-purple-600 dark:text-purple-400">def</span>{' '}
          <span className="font-semibold text-blue-600 dark:text-sky-300">fibonacci</span>
          <span className="text-slate-400 dark:text-slate-300">(</span>
          <span className="text-slate-800 dark:text-slate-100">n</span>
          <span className="text-slate-400 dark:text-slate-300">:</span>{' '}
          <span className="text-amber-600 dark:text-yellow-300">int</span>
          <span className="text-slate-400 dark:text-slate-300">)</span>{' '}
          <span className="text-purple-600 dark:text-purple-400">-&gt;</span>{' '}
          <span className="text-amber-600 dark:text-yellow-300">list</span>
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-amber-600 dark:text-yellow-300">int</span>
          <span className="text-slate-400 dark:text-slate-300">]:</span>
        </p>
        <p className="pl-4">
          <span className="text-slate-800 dark:text-slate-100">seq</span>{' '}
          <span className="text-pink-600 dark:text-pink-400">=</span>{' '}
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-amber-600 dark:text-amber-300">0</span>
          <span className="text-slate-400 dark:text-slate-300">, </span>
          <span className="text-amber-600 dark:text-amber-300">1</span>
          <span className="text-slate-400 dark:text-slate-300">]</span>
        </p>
        <p className="pl-4">
          <span className="font-semibold text-purple-600 dark:text-purple-400">for</span>{' '}
          <span className="text-slate-800 dark:text-slate-100">_</span>{' '}
          <span className="font-semibold text-purple-600 dark:text-purple-400">in</span>{' '}
          <span className="font-semibold text-teal-600 dark:text-cyan-300">range</span>
          <span className="text-slate-400 dark:text-slate-300">(</span>
          <span className="text-slate-800 dark:text-slate-100">n</span>{' '}
          <span className="text-pink-600 dark:text-pink-400">-</span>{' '}
          <span className="text-amber-600 dark:text-amber-300">2</span>
          <span className="text-slate-400 dark:text-slate-300">):</span>
        </p>
        <p className="pl-8">
          <span className="text-slate-800 dark:text-slate-100">seq</span>
          <span className="text-slate-400 dark:text-slate-300">.</span>
          <span className="font-semibold text-teal-600 dark:text-cyan-300">append</span>
          <span className="text-slate-400 dark:text-slate-300">(</span>
          <span className="text-slate-800 dark:text-slate-100">seq</span>
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-pink-600 dark:text-pink-400">-</span>
          <span className="text-amber-600 dark:text-amber-300">1</span>
          <span className="text-slate-400 dark:text-slate-300">]</span>{' '}
          <span className="text-pink-600 dark:text-pink-400">+</span>{' '}
          <span className="text-slate-800 dark:text-slate-100">seq</span>
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-pink-600 dark:text-pink-400">-</span>
          <span className="text-amber-600 dark:text-amber-300">2</span>
          <span className="text-slate-400 dark:text-slate-300">])</span>
        </p>
        <p className="pl-4">
          <span className="font-semibold text-purple-600 dark:text-purple-400">return</span>{' '}
          <span className="font-medium text-slate-800 dark:text-slate-100">seq</span>
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] dark:border-slate-800">
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Output: [0, 1, 1, 2, 3, 5, 8]
          </span>
          <span className="font-mono text-slate-400 dark:text-gray-500">0.001s</span>
        </div>
      </div>
    </div>
  )
}
