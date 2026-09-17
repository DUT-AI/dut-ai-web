"use client";

import React, { useState } from "react";

export default function NLPCanvas() {
  const [activeToken, setActiveToken] = useState(1);
  const tokens = ["The", "neural", "model", "understands", "context"];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl text-left font-mono transition-colors duration-200">
      <div className="flex items-center justify-between mb-3 font-sans">
        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-900/40 px-2 py-0.5 rounded-md">
          Attention Mechanism
        </span>
        <span className="text-[11px] text-slate-500 dark:text-gray-400 font-mono">d_model=768</span>
      </div>

      {/* Interactive Token Row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tokens.map((tok, i) => (
          <button
            key={tok}
            onClick={() => setActiveToken(i)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
              activeToken === i
                ? "bg-cyan-500 text-white dark:text-black font-bold shadow-md shadow-cyan-500/30"
                : "bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700"
            }`}
          >
            {tok}
          </button>
        ))}
      </div>

      {/* Attention Heatmap Weights */}
      <div className="space-y-1.5 text-[11px]">
        {tokens.map((tok, i) => {
          const diff = Math.abs(activeToken - i);
          const weight = diff === 0 ? 0.95 : diff === 1 ? 0.72 : diff === 2 ? 0.45 : 0.18;
          return (
            <div key={tok} className="flex items-center gap-2">
              <span className="w-20 text-slate-600 dark:text-gray-400 text-right truncate">{tok}:</span>
              <div className="flex-1 bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${weight * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 w-8 text-right font-mono font-semibold">
                {weight.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
