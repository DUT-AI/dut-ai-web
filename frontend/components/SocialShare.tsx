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
                className="flex items-center justify-center bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:scale-105 active:scale-95 text-gray-600 dark:text-gray-300 shrink-0 cursor-pointer"
                aria-label="Copy link"
                title="Sao chép liên kết"
            >
                {copied ? (
                    <Check size={16} className="text-green-500" />
                ) : (
                    <LinkIcon size={16} />
                )}
            </button>
            {showMobileLabel && (
                <div onClick={copyUrl} className="sm:hidden cursor-pointer select-none text-left min-w-0">
                    <span className="block text-[11px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase leading-none mb-1">
                        Chia sẻ
                    </span>
                    <span className={`text-sm font-extrabold leading-tight block truncate transition-colors ${copied ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {copied ? 'Đã chép!' : 'Sao chép'}
                    </span>
                </div>
            )}
        </div>
    )
}

export default SocialShare
