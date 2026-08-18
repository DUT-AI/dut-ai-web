'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
    onCopy: () => string
}

const CopyButton = ({ onCopy }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            const text = onCopy()
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/10 active:scale-95 ${copied ? 'text-green-400' : 'text-zinc-400'
                } backdrop-blur-sm`}
            aria-label="Copy code"
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    )
}

export default CopyButton
