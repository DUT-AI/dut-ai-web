'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Code2, Eye, Maximize2, X } from 'lucide-react'
import CopyButton from '@/components/common/CopyButton'
import { validateMermaid } from '../lib/mermaid-renderer'
import MermaidDiagram from './MermaidDiagram'

interface MermaidBlockProps {
  source: string
  children?: ReactNode
}

export default function MermaidBlock({ source, children }: MermaidBlockProps) {
  const id = useId()
  const [validation, setValidation] = useState<{ source: string; valid: boolean } | null>(null)
  const [mode, setMode] = useState<'code' | 'diagram'>('code')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Debounce live editor changes; the module itself is shared and loaded lazily.
    const timer = setTimeout(() => {
      validateMermaid(source).then(
        (valid) => {
          if (!cancelled) setValidation({ source, valid })
        },
        () => {
          if (!cancelled) setValidation({ source, valid: false })
        }
      )
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [source])

  if (validation?.source !== source || !validation.valid) {
    return <>{children}</>
  }

  const buttonClass =
    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-slate-200/70 dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'

  const toolbar = (suffix: string) => (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
        <span aria-hidden="true" className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        mermaid
      </span>
      <div className="flex flex-wrap items-center gap-1 text-slate-600 dark:text-slate-300">
        <div
          role="tablist"
          aria-label="Chế độ hiển thị Mermaid"
          className="flex rounded-xl border border-slate-200 p-0.5 dark:border-slate-700"
        >
          {(['diagram', 'code'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`${id}-${suffix}-${tab}`}
              aria-selected={mode === tab}
              aria-controls={`${id}-${suffix}-panel`}
              tabIndex={mode === tab ? 0 : -1}
              onClick={() => setMode(tab)}
              onKeyDown={(event) => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                  event.preventDefault()
                  const next =
                    event.key === 'Home'
                      ? 'diagram'
                      : event.key === 'End'
                        ? 'code'
                        : tab === 'code'
                          ? 'diagram'
                          : 'code'
                  setMode(next)
                  document.getElementById(`${id}-${suffix}-${next}`)?.focus()
                }
              }}
              className={`${buttonClass} ${mode === tab ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400' : ''}`}
            >
              {tab === 'diagram' ? <Eye size={14} /> : <Code2 size={14} />}
              {tab === 'diagram' ? 'Diagram' : 'Code'}
            </button>
          ))}
        </div>
        {suffix === 'inline' && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={buttonClass}
            aria-label="Phóng to block Mermaid"
          >
            <Maximize2 size={14} /> Expand
          </button>
        )}
        <CopyButton onCopy={() => source} className={buttonClass} showLabel />
      </div>
    </div>
  )

  const content = (suffix: string) => (
    <div
      role="tabpanel"
      id={`${id}-${suffix}-panel`}
      aria-labelledby={`${id}-${suffix}-${mode}`}
      tabIndex={0}
      className="min-h-0 min-w-0 overflow-auto focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      {mode === 'diagram' ? (
        <MermaidDiagram source={source} expanded={suffix === 'expanded'} />
      ) : (
        <pre className="m-0 overflow-auto bg-[#0d1117] p-5 text-sm leading-7 text-slate-100">
          <code>{source}</code>
        </pre>
      )}
    </div>
  )

  return (
    <section
      aria-label="Khối sơ đồ Mermaid"
      className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950"
    >
      {toolbar('inline')}
      {content('inline')}
      <Dialog open={expanded} onClose={() => setExpanded(false)} className="fixed inset-0 z-[100]">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
          <DialogPanel className="not-prose flex max-h-[90dvh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between px-4 py-3 text-slate-800 dark:text-slate-100">
              <DialogTitle className="text-sm font-semibold">Mermaid — Xem phóng to</DialogTitle>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className={buttonClass}
                aria-label="Đóng chế độ phóng to"
              >
                <X size={20} />
              </button>
            </div>
            {toolbar('expanded')}
            {content('expanded')}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  )
}
