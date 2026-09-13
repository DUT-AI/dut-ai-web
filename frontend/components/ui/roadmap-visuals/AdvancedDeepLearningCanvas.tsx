"use client";

import React from "react";

export default function AdvancedDeepLearningCanvas() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl text-left transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded-md">
          Transformer Block (x12)
        </span>
        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">8 Heads</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-700/60 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
            Multi-Head Self-Attention
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-medium">Q, K, V Proj</span>
        </div>
        <div className="w-full text-center text-indigo-600 dark:text-indigo-400 text-xs py-0.5 font-medium">↓ Add & LayerNorm</div>
        <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-700/60 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
            Feed Forward Network
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-medium">d_ff = 3072</span>
        </div>
        <div className="w-full text-center text-indigo-600 dark:text-indigo-400 text-xs py-0.5 font-medium">↓ Add & LayerNorm</div>
        <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-700/40 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
          <span className="font-semibold">Vision / Text Output State</span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Softmax</span>
        </div>
      </div>
    </div>
  );
}
