"use client";

import React from "react";

export default function LLMInteractiveVisual() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl text-left transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/40 px-2 py-0.5 rounded-md flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          RAG + Vector Search
        </span>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Tokens/s: 85</span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
          <span className="text-blue-500 font-bold">Q: </span>
          <span>Tóm tắt kiến trúc Transformer và MoE?</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-gray-900/90 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-200 leading-relaxed font-sans">
          <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">Agent: </span>
          Mixture of Experts (MoE) kích hoạt một tập hợp chuyên gia thưa thớt (sparse experts) giúp tăng
          tham số mà vẫn giữ chi phí tính toán cố định...
          <span className="inline-block w-2 h-3.5 bg-blue-500 ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
