'use client'

import { Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
    url: string
}

const SocialShare = ({ url }: SocialShareProps) => {
    const [copied, setCopied] = useState(false)

    const copyUrl = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={copyUrl}
                className="flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-110 active:scale-95"
                aria-label="Copy link"
            >
                {copied ? (
                    <Check size={18} className="text-green-500" />
                ) : (
                    <LinkIcon size={18} className="text-gray-700 dark:text-gray-300" />
                )}
            </button>
        </div>
    )
}

export default SocialShare
