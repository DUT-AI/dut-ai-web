"use client";

import React from "react";

export default function DataScienceMLVisual() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-900/40 p-4 shadow-[0_10px_30px_rgb(0,0,0,0.05)] text-left">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-md">
          Model Evaluation
        </span>
        <span className="text-[11px] font-mono text-emerald-500 font-semibold">F1: 0.962</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-xl bg-orange-50/50 dark:bg-gray-800/80 border border-orange-100/60 dark:border-gray-700">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
            Accuracy
          </p>
          <p className="text-lg font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">98.4%</p>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-gray-800/80 border border-blue-100/60 dark:border-gray-700">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
            AUC-ROC
          </p>
          <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">0.991</p>
        </div>
      </div>
      {/* Mini Feature Importance Bars */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>Feature: Age_Normalized</span>
          <span className="font-mono text-[10px] text-gray-400">0.42</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-full rounded-full w-[82%]" />
        </div>
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>Feature: Embed_PCA_1</span>
          <span className="font-mono text-[10px] text-gray-400">0.28</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full w-[56%]" />
        </div>
      </div>
    </div>
  );
}
