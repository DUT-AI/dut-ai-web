'use client'

import React from 'react'
import Script from 'next/script'

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

export function DutaiWaffle({ current = 'manage' }: DutaiWaffleProps) {
  return (
    <div className="flex items-center">
      <Script src="https://workspace.dutai.io.vn/waffle.js" strategy="lazyOnload" />
      {/* @ts-ignore Custom Web Component */}
      <dutai-waffle current={current} />
    </div>
  )
}

export default DutaiWaffle
