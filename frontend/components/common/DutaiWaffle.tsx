'use client'

import React, { useEffect, useSyncExternalStore } from 'react'

interface DutaiWaffleProps {
  current?: 'manage' | 'lms' | 'meetly' | 'data' | string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dutai-waffle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          current?: string
        },
        HTMLElement
      >
    }
  }
  namespace React.JSX {
    interface IntrinsicElements {
      'dutai-waffle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          current?: string
        },
        HTMLElement
      >
    }
  }
}

const WAFFLE_SCRIPT_URL = 'https://workspace.dutai.io.vn/waffle.js'
const emptySubscribe = () => () => {}

export function DutaiWaffle({ current = 'manage' }: DutaiWaffleProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  useEffect(() => {
    // Inject script only once if not already present in document.head
    const existing = document.querySelector(`script[src="${WAFFLE_SCRIPT_URL}"]`)
    if (!existing) {
      const script = document.createElement('script')
      script.src = WAFFLE_SCRIPT_URL
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  if (!isMounted) {
    return <div className="h-9 w-9" aria-hidden="true" />
  }

  return (
    <div className="flex items-center">
      {/* @ts-ignore Custom Web Component */}
      <dutai-waffle current={current} />
    </div>
  )
}

export default DutaiWaffle
