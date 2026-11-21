'use client'

import React from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { Loader2 } from 'lucide-react'
import { useIsMounted } from '@/lib/hooks/useIsMounted'

export interface GithubCalendarProps {
  username?: string | null
}

/**
 * Extracts a valid GitHub handle from input.
 * Returns null if the value is not a valid GitHub username/URL.
 */
function extractValidGitHubUsername(input?: string | null): string | null {
  if (!input) return null

  const trimmed = input.trim()

  // If user entered a local/arbitrary URL like "http://localhost:3000/admin/portfolio"
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    // Only accept URLs belonging to github.com
    const githubMatch = trimmed.match(/^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)/i)
    if (githubMatch && githubMatch[2]) {
      return githubMatch[2]
    }
    // Not a GitHub URL
    return null
  }

  // If user entered just a username, validate characters (alphanumeric and hyphens, max 39 chars)
  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(trimmed)) {
    return trimmed
  }

  return null
}

export default function PortfolioGithubCalendar({ username }: GithubCalendarProps) {
  const mounted = useIsMounted()
  const cleanUsername = extractValidGitHubUsername(username)

  // Don't render anything if there's no valid GitHub username
  if (!cleanUsername) {
    return null
  }

  // DUT-AI Blue theme palette
  const blueTheme = {
    light: ['#1e293b', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
    dark: ['#0f172a', '#1e40af', '#2563eb', '#3b82f6', '#93c5fd'],
  }

  return (
    <div className="mt-16 flex flex-col items-center">
      <h3 className="mb-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Days I <span className="text-blue-500">Code</span>
      </h3>

      <div className="w-full overflow-x-auto rounded-2xl border border-blue-500/20 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <div className="flex min-w-[700px] flex-col items-center justify-center">
          {mounted ? (
            <GitHubCalendar
              username={cleanUsername}
              blockSize={14}
              blockMargin={4}
              fontSize={14}
              colorScheme="dark"
              theme={blueTheme}
              labels={{
                totalCount: '{{count}} contributions in the last year',
              }}
            />
          ) : (
            <div className="flex h-32 items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span>Đang tải hoạt động GitHub...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
