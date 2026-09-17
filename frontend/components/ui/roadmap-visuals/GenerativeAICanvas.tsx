"use client";

import React, { useState } from "react";

export default function GenerativeAICanvas() {
  const [step, setStep] = useState(50);

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl text-left transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-900/40 px-2 py-0.5 rounded-md">
          Diffusion Denoising
        </span>
        <span className="text-[11px] font-mono text-orange-600 dark:text-orange-300 font-semibold">Step {step}/50</span>
      </div>

      {/* Denoising visual representation */}
      <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3 flex items-center justify-center bg-slate-100 dark:bg-black border border-slate-200 dark:border-gray-800">
        {/* Generative art gradient revealing beneath noise */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-orange-500 via-pink-500 to-indigo-600 transition-opacity duration-300"
          style={{ opacity: step / 50 }}
        />
        {/* Dynamic canvas noise layer */}
        <div
          className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] mix-blend-overlay transition-opacity duration-300"
          style={{ opacity: (50 - step) / 50 + 0.2 }}
        />
        <span className="relative z-10 text-white font-extrabold text-sm tracking-wider drop-shadow-md">
          {step === 50 ? "✨ Generated Artwork" : `Denoising... ${step * 2}%`}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max="50"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-gray-700 rounded-lg"
        />
      </div>
    </div>
  );
}
