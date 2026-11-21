'use client'

import React, { useEffect, useState } from 'react'

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

const WAFFLE_SCRIPT_URL = 'https://workspace.dutai.io.vn/waffle.js?v=2'

export function DutaiWaffle({ current = 'manage' }: DutaiWaffleProps) {
  const [isDefined, setIsDefined] = useState(false)

  useEffect(() => {
    // Xóa cache cũ của ecosystem apps nếu có để nhận dữ liệu và icon mới nhất
    try {
      sessionStorage.removeItem('dutai_ecosystem_apps')
    } catch { }

    // Chờ customElements.whenDefined
    customElements.whenDefined('dutai-waffle').then(() => {
      setIsDefined(true)
    })

    // Nạp script nếu chưa có
    const scriptSelector = `script[src="${WAFFLE_SCRIPT_URL}"]`
    const existing = document.querySelector(scriptSelector) as HTMLScriptElement | null
    if (!existing) {
      const script = document.createElement('script')
      script.src = WAFFLE_SCRIPT_URL
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      {/* Fallback nút 9 chấm hiển thị ngay lập tức trong lúc script đang tải */}
      {!isDefined && (
        <div
          className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-slate-600 transition-colors dark:text-slate-300"
          title="Ứng dụng DUT-AI"
        >
          <div className="grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-[1px] bg-current" />
            ))}
          </div>
        </div>
      )}

      {/* Web Component chính */}
      <div className={!isDefined ? 'hidden' : 'block'}>
        {/* @ts-ignore Custom Web Component */}
        <dutai-waffle current={current} />
      </div>
    </div>
  )
}

export default DutaiWaffle
