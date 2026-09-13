'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deletePostAction, deletePublicEventAction } from './actions'

interface DeleteEventItemButtonProps {
  id: number
  kind: 'event' | 'moment'
  title: string
}

export default function DeleteEventItemButton({ id, kind, title }: DeleteEventItemButtonProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    const label = kind === 'event' ? 'sự kiện' : 'khoảnh khắc'
    if (!window.confirm(`Bạn có chắc muốn xóa ${label} “${title}”?`)) return

    setError(null)
    startTransition(async () => {
      const result =
        kind === 'event' ? await deletePublicEventAction(id) : await deletePostAction(id)

      if (result.error) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <Button
        variant="destructive"
        size="sm"
        className="h-8 gap-1 text-xs"
        type="button"
        disabled={pending}
        onClick={handleDelete}
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        <span>{pending ? 'Đang xóa...' : 'Xóa'}</span>
      </Button>
      {error && <span className="max-w-48 text-right text-xs text-red-600">{error}</span>}
    </div>
  )
}
