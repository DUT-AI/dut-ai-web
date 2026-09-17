"use client";

import React, { useState } from "react";

export default function AudioProcessingVisual() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-gray-900 border border-pink-100 dark:border-pink-900/40 p-4 shadow-[0_10px_30px_rgb(0,0,0,0.05)] text-left">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-md">
          Speech-to-Text (ASR)
        </span>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[11px] font-medium text-pink-600 dark:text-pink-400 hover:underline"
        >
          {isPlaying ? "Live Audio" : "Paused"}
        </button>
      </div>

      {/* Waveform Equalizer Animation */}
      <div className="flex items-end justify-between gap-1 h-16 px-2 py-2 bg-pink-50/50 dark:bg-gray-800/80 rounded-xl mb-3">
        {[35, 65, 90, 45, 80, 100, 55, 95, 70, 85, 40, 75, 90, 60, 85, 45, 95, 30].map(
          (height, i) => (
            <div
              key={i}
              className={`w-1.5 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full transition-all duration-300 ${
                isPlaying ? "animate-pulse" : ""
              }`}
              style={{
                height: isPlaying ? `${height}%` : "20%",
                animationDelay: `${(i % 5) * 0.15}s`,
              }}
            />
          )
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <span className="font-mono text-[11px] text-gray-500">16kHz Mel-Spectrogram</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
          WER: 2.1% (Whisper)
        </span>
      </div>
    </div>
  );
}
