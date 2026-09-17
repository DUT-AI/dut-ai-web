"use client";

import React from "react";

export default function PythonVisual() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl overflow-hidden font-mono text-xs transition-colors duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-[11px] text-slate-500 dark:text-gray-400 ml-2 font-sans font-medium">main.py</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-semibold border border-blue-100 dark:border-blue-900/40">
          Python 3.12
        </span>
      </div>
      <div className="space-y-1.5 leading-5 text-slate-800 dark:text-slate-100">
        <p>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">def</span>{" "}
          <span className="text-blue-600 dark:text-sky-300 font-semibold">fibonacci</span>
          <span className="text-slate-400 dark:text-slate-300">(</span>
          <span className="text-slate-800 dark:text-slate-100">n</span>
          <span className="text-slate-400 dark:text-slate-300">:</span>{" "}
          <span className="text-amber-600 dark:text-yellow-300">int</span>
          <span className="text-slate-400 dark:text-slate-300">)</span>{" "}
          <span className="text-purple-600 dark:text-purple-400">-&gt;</span>{" "}
          <span className="text-amber-600 dark:text-yellow-300">list</span>
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-amber-600 dark:text-yellow-300">int</span>
          <span className="text-slate-400 dark:text-slate-300">]:</span>
        </p>
        <p className="pl-4">
          <span className="text-slate-800 dark:text-slate-100">seq</span>{" "}
          <span className="text-pink-600 dark:text-pink-400">=</span>{" "}
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-amber-600 dark:text-amber-300">0</span>
          <span className="text-slate-400 dark:text-slate-300">, </span>
          <span className="text-amber-600 dark:text-amber-300">1</span>
          <span className="text-slate-400 dark:text-slate-300">]</span>
        </p>
        <p className="pl-4">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">for</span>{" "}
          <span className="text-slate-800 dark:text-slate-100">_</span>{" "}
          <span className="text-purple-600 dark:text-purple-400 font-semibold">in</span>{" "}
          <span className="text-teal-600 dark:text-cyan-300 font-semibold">range</span>
          <span className="text-slate-400 dark:text-slate-300">(</span>
          <span className="text-slate-800 dark:text-slate-100">n</span>{" "}
          <span className="text-pink-600 dark:text-pink-400">-</span>{" "}
          <span className="text-amber-600 dark:text-amber-300">2</span>
          <span className="text-slate-400 dark:text-slate-300">):</span>
        </p>
        <p className="pl-8">
          <span className="text-slate-800 dark:text-slate-100">seq</span>
          <span className="text-slate-400 dark:text-slate-300">.</span>
          <span className="text-teal-600 dark:text-cyan-300 font-semibold">append</span>
          <span className="text-slate-400 dark:text-slate-300">(</span>
          <span className="text-slate-800 dark:text-slate-100">seq</span>
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-pink-600 dark:text-pink-400">-</span>
          <span className="text-amber-600 dark:text-amber-300">1</span>
          <span className="text-slate-400 dark:text-slate-300">]</span>{" "}
          <span className="text-pink-600 dark:text-pink-400">+</span>{" "}
          <span className="text-slate-800 dark:text-slate-100">seq</span>
          <span className="text-slate-400 dark:text-slate-300">[</span>
          <span className="text-pink-600 dark:text-pink-400">-</span>
          <span className="text-amber-600 dark:text-amber-300">2</span>
          <span className="text-slate-400 dark:text-slate-300">])</span>
        </p>
        <p className="pl-4">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">return</span>{" "}
          <span className="text-slate-800 dark:text-slate-100 font-medium">seq</span>
        </p>
        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Output: [0, 1, 1, 2, 3, 5, 8]
          </span>
          <span className="text-slate-400 dark:text-gray-500 font-mono">0.001s</span>
        </div>
      </div>
    </div>
  );
}
