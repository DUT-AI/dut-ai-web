'use client'

import React from 'react'

export default function DataScienceMLVisual() {
  return (
    <div className="w-full rounded-2xl border border-orange-100 bg-white p-4 text-left shadow-[0_10px_30px_rgb(0,0,0,0.05)] dark:border-orange-900/40 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
          Model Evaluation
        </span>
        <span className="font-mono text-[11px] font-semibold text-emerald-500">F1: 0.962</span>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-orange-100/60 bg-orange-50/50 p-2.5 dark:border-gray-700 dark:bg-gray-800/80">
          <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Accuracy
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-orange-600 dark:text-orange-400">
            98.4%
          </p>
        </div>
        <div className="rounded-xl border border-blue-100/60 bg-blue-50/50 p-2.5 dark:border-gray-700 dark:bg-gray-800/80">
          <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            AUC-ROC
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-blue-600 dark:text-blue-400">0.991</p>
        </div>
      </div>
      {/* Mini Feature Importance Bars */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>Feature: Age_Normalized</span>
          <span className="font-mono text-[10px] text-gray-400">0.42</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full w-[82%] rounded-full bg-orange-500" />
        </div>
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>Feature: Embed_PCA_1</span>
          <span className="font-mono text-[10px] text-gray-400">0.28</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full w-[56%] rounded-full bg-amber-500" />
        </div>
      </div>
    </div>
  )
}
