import React from 'react'

export default function MemberPortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#0c0513] text-white">
      {/* Top Navbar Skeleton */}
      <div className="h-16 w-full border-b border-blue-500/20 bg-slate-950/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-slate-800" />
          <div className="hidden h-9 w-64 animate-pulse rounded-full bg-slate-800 md:block" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-800" />
        </div>
      </div>

      {/* Main Body Skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-full bg-blue-900/40" />
            <div className="h-12 w-3/4 animate-pulse rounded-xl bg-slate-800" />
            <div className="h-8 w-1/2 animate-pulse rounded-lg bg-slate-800" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-slate-800/60" />
            <div className="flex gap-4 pt-4">
              <div className="h-11 w-36 animate-pulse rounded-xl bg-blue-600/50" />
              <div className="h-11 w-32 animate-pulse rounded-xl bg-slate-800" />
            </div>
          </div>
          <div className="h-64 w-64 animate-pulse rounded-full border-4 border-blue-500/20 bg-slate-900" />
        </div>
      </div>
    </div>
  )
}
