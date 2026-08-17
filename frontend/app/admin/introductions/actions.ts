'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  updateIntroductionQuery,
  createIntroductionQuery,
} from '@/lib/db/features/introductions/queries'
import { getAdminSession } from '@/lib/admin-auth'

export async function saveIntroductionAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined
  const content = (formData.get('content') as string)?.trim()

  if (!content) {
    return { error: 'Nội dung giới thiệu không được để trống.' }
  }

  try {
    if (id) {
      await updateIntroductionQuery(id, content)
    } else {
      await createIntroductionQuery(content)
    }

    revalidateTag('introductions', 'homepage')
  } catch (error: any) {
    console.error('Failed to save introduction:', error)
    return { error: error?.message || 'Lỗi khi lưu giới thiệu.' }
  }

  redirect('/admin/introductions')
}
