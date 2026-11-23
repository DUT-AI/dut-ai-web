'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  onCopy: () => string
  className?: string
  showLabel?: boolean
}

const CopyButton = ({ onCopy, className, showLabel = false }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    try {
      const text = onCopy()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${className ?? 'absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95'} ${
        copied ? 'text-green-600 dark:text-green-400' : className ? '' : 'text-zinc-400'
      }`}
      aria-label={copied ? 'Đã sao chép' : 'Copy code'}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {showLabel && <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>}
    </button>
  )
}

export default CopyButton
