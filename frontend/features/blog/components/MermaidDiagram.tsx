'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { renderMermaid } from '../lib/mermaid-renderer'

export default function MermaidDiagram({
  source,
  expanded = false,
}: {
  source: string
  expanded?: boolean
}) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'
  const key = `${dark}:${source}`
  const [result, setResult] = useState<{ key: string; svg?: string; error?: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    renderMermaid(source, dark).then(
      (svg) => {
        if (!cancelled) setResult({ key, svg })
      },
      () => {
        if (!cancelled) {
          setResult({
            key,
            error: 'Không thể dựng sơ đồ. Bạn vẫn có thể xem và sao chép mã nguồn.',
          })
        }
      }
    )
    return () => {
      cancelled = true
    }
  }, [source, dark, key])

  if (!result || result.key !== key) {
    return (
      <div
        role="status"
        className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Đang dựng sơ đồ…
      </div>
    )
  }

  if (result.error) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600 dark:text-red-400">
        {result.error}
      </p>
    )
  }

  return (
    <div
      role="img"
      aria-label="Sơ đồ Mermaid"
      className={`overflow-auto p-4 sm:p-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-none ${expanded ? '[&_svg]:min-w-full' : ''}`}
      // Only SVG produced by Mermaid with locked strict security is inserted here.
      dangerouslySetInnerHTML={{ __html: result.svg || '' }}
    />
  )
}
