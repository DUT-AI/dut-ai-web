'use client'

import { Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
  url: string
  showMobileLabel?: boolean
}

const SocialShare = ({ url, showMobileLabel = false }: SocialShareProps) => {
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <button
        onClick={copyUrl}
        className="dark:bg-gray-850 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-600 shadow-xs transition-all hover:scale-105 hover:bg-gray-50 active:scale-95 sm:h-11 sm:w-11 dark:border-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Copy link"
        title="Sao chép liên kết"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} />}
      </button>
      {showMobileLabel && (
        <div onClick={copyUrl} className="min-w-0 cursor-pointer text-left select-none sm:hidden">
          <span className="mb-1 block text-[11px] leading-none font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Chia sẻ
          </span>
          <span
            className={`block truncate text-sm leading-tight font-extrabold transition-colors ${copied ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}
          >
            {copied ? 'Đã chép!' : 'Sao chép'}
          </span>
        </div>
      )}
    </div>
  )
}

export default SocialShare
