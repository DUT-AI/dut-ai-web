'use client'

import React, { useState } from 'react'
import {
  Download,
  FileText,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  ShieldCheck,
  Eye,
} from 'lucide-react'

export interface PortfolioResumeProps {
  cvUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
}

export default function PortfolioResume({ cvUrl }: PortfolioResumeProps) {
  const [loadError, setLoadError] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)

  if (!cvUrl) {
    return (
      <div className="relative z-10 py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-blue-500/20 bg-slate-900/60 p-10 shadow-2xl backdrop-blur-md">
          <FileText className="mx-auto h-14 w-14 text-slate-500" />
          <h3 className="mt-4 text-xl font-bold text-white">Chưa cập nhật CV</h3>
          <p className="mt-2 text-sm text-slate-400">
            Thành viên này hiện chưa đính kèm tài liệu Curriculum Vitae (CV) trong hồ sơ.
          </p>
        </div>
      </div>
    )
  }

  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(cvUrl)}&embedded=true`

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 140))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 80))

  return (
    <div className="relative z-10 flex flex-col items-center py-10">
      {/* 1. Sleek Minimal Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Curriculum <span className="text-blue-500">Vitae</span>
        </h2>
      </div>

      {/* 2. Interactive Document Studio Frame */}
      <div className="mt-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-950 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.35)] backdrop-blur-2xl">
        {/* Modern Studio Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/90 bg-slate-900/90 px-4 py-2.5 sm:px-6">
          {/* Left: Window Dots + Verified Document Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80 transition-opacity hover:opacity-100" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80 transition-opacity hover:opacity-100" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80 transition-opacity hover:opacity-100" />
            </div>

            <div className="hidden items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Document</span>
            </div>
          </div>

          {/* Center: Live Zoom Controls */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/80 p-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              title="Thu nhỏ"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-12 text-center text-xs font-semibold text-slate-300">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              title="Phóng to"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Right: Quick Expand */}
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-blue-400"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Toàn màn hình</span>
          </a>
        </div>

        {/* Document Canvas Container with Zoom Transformer */}
        <div className="relative min-h-[700px] w-full overflow-auto bg-slate-950 p-2 sm:min-h-[900px] sm:p-4">
          <div
            className="mx-auto h-full w-full transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {!loadError ? (
              <iframe
                src={`${cvUrl}#toolbar=0&navpanes=0`}
                title="CV Document"
                className="h-[700px] w-full rounded-lg border border-slate-800/60 bg-white shadow-2xl sm:h-[900px]"
                onError={() => setLoadError(true)}
              />
            ) : (
              <iframe
                src={googleDocsViewerUrl}
                title="CV Document Fallback"
                className="h-[700px] w-full rounded-lg border border-slate-800/60 bg-white shadow-2xl sm:h-[900px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Modern Action Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {/* Primary Download Button */}
        <a
          href={cvUrl}
          download="Huynh_Phuoc_Nguyen_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_8px_30px_rgba(37,99,235,0.6)]"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          <span>Download Official PDF</span>
        </a>

        {/* Secondary Clean Action */}
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-slate-800 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 text-blue-400" />
          <span>Mở Tab Mới</span>
        </a>
      </div>
    </div>
  )
}
