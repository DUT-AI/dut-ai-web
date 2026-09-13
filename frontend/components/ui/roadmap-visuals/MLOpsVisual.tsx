"use client";

import React from "react";

export default function MLOpsVisual() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/40 p-4 shadow-[0_10px_30px_rgb(0,0,0,0.05)] text-left">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
          CI/CD & Deployment
        </span>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Kubernetes Live
        </span>
      </div>

      {/* Pipeline Steps */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold mb-3">
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
          ✓ Build
        </div>
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
          ✓ Test
        </div>
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
          ✓ Triton
        </div>
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
          Monitor
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Latency: <strong className="text-gray-800 dark:text-gray-200 font-mono">14ms</strong></span>
        <span>Drift Score: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">0.01</strong></span>
      </div>
    </div>
  );
}
