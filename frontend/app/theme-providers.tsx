'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'

// Suppress React 19 false-positive warning for next-themes internal inline script
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return
    }
    originalConsoleError.apply(console, args)
  }
}

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
