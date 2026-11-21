'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createKeywordQuery,
  updateKeywordQuery,
  deleteKeywordQuery,
} from '@/features/blog/keywords/queries'
import { getAdminSession } from '@/lib/admin-auth'
import { hasContentAccess } from '@/lib/enums/roles'

export async function saveKeywordAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated || !hasContentAccess(session.user)) {
    return {
      error:
        'Bạn không có quyền thực hiện hành động này. Yêu cầu vai trò Content hoặc Quản trị viên.',
    }
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
  if (!session.authenticated || !hasContentAccess(session.user)) {
    throw new Error('FORBIDDEN_CONTENT_ROLE_REQUIRED')
  }

  await deleteKeywordQuery(id)
  revalidateTag('blogs', 'default')
  redirect('/admin/keywords')
}
