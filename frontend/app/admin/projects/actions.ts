'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createProjectQuery,
  updateProjectQuery,
  deleteProjectQuery,
} from '@/lib/db/features/projects/queries'
import { getAdminSession } from '@/lib/admin-auth'

export async function saveProjectAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const imageUrl = (formData.get('imageUrl') as string)?.trim()
  const features = (formData.get('features') as string)?.trim()
  const technologies = (formData.get('technologies') as string)?.trim()
  const demoUrl = (formData.get('demoUrl') as string)?.trim()
  const videoUrl = (formData.get('videoUrl') as string)?.trim()

  const userIdsRaw = formData.getAll('userIds') as string[]
  const rolesRaw = formData.getAll('roles') as string[]

  const members = userIdsRaw
    .map((uId, idx) => ({
      user_id: parseInt(uId, 10),
      role: rolesRaw[idx] || 'Member',
    }))
    .filter((m) => !isNaN(m.user_id))

  if (!title) {
    return { error: 'Tiêu đề dự án không được để trống.' }
  }

  try {
    if (id) {
      await updateProjectQuery(id, {
        title,
        description,
        image_url: imageUrl || undefined,
        features,
        technologies,
        demo_url: demoUrl || undefined,
        video_url: videoUrl || undefined,
        members,
      })
    } else {
      await createProjectQuery({
        title,
        description,
        image_url: imageUrl || undefined,
        features,
        technologies,
        demo_url: demoUrl || undefined,
        video_url: videoUrl || undefined,
        members,
      })
    }

    revalidateTag('projects', 'homepage')
  } catch (error: any) {
    console.error('Failed to save project:', error)
    return { error: error?.message || 'Lỗi khi lưu dự án.' }
  }

  redirect('/admin/projects')
}

export async function deleteProjectAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('Unauthorized')
  }

  await deleteProjectQuery(id)
  revalidateTag('projects', 'homepage')
  redirect('/admin/projects')
}
