'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createKeywordQuery,
  updateKeywordQuery,
  deleteKeywordQuery,
} from '@/lib/db/features/keywords/queries'
import { getAdminSession } from '@/lib/admin-auth'

export async function saveKeywordAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined
  const keywordName = (formData.get('keywordName') as string)?.trim()

  if (!keywordName) {
    return { error: 'Tên từ khóa không được để trống.' }
  }

  try {
    if (id) {
      await updateKeywordQuery(id, keywordName)
    } else {
      await createKeywordQuery(keywordName)
    }

    revalidateTag('blogs', 'default')
  } catch (error: any) {
    console.error('Failed to save keyword:', error)
    return { error: error?.message || 'Lỗi khi lưu từ khóa.' }
  }

  redirect('/admin/keywords')
}

export async function deleteKeywordAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('Unauthorized')
  }

  await deleteKeywordQuery(id)
  revalidateTag('blogs', 'default')
  redirect('/admin/keywords')
}
