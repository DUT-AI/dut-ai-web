'use client'

import React, { useState } from 'react'

export default function GenerativeAICanvas() {
  const [step, setStep] = useState(50)

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md border border-orange-100 bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600 dark:border-orange-900/40 dark:bg-orange-500/10 dark:text-orange-400">
          Diffusion Denoising
        </span>
        <span className="font-mono text-[11px] font-semibold text-orange-600 dark:text-orange-300">
          Step {step}/50
        </span>
      </div>

      {/* Denoising visual representation */}
      <div className="relative mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-gray-800 dark:bg-black">
        {/* Generative art gradient revealing beneath noise */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-orange-500 via-pink-500 to-indigo-600 transition-opacity duration-300"
          style={{ opacity: step / 50 }}
        />
        {/* Dynamic canvas noise layer */}
        <div
          className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] mix-blend-overlay transition-opacity duration-300 dark:bg-[radial-gradient(#fff_1px,transparent_1px)]"
          style={{ opacity: (50 - step) / 50 + 0.2 }}
        />
        <span className="relative z-10 text-sm font-extrabold tracking-wider text-white drop-shadow-md">
          {step === 50 ? '✨ Generated Artwork' : `Denoising... ${step * 2}%`}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max="50"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-orange-500 dark:bg-gray-700"
        />
      </div>
    </div>
  )
}
