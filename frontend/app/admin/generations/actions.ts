'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { getManageUsers } from '@/lib/manage-users'
import {
  createGenerationQuery,
  deleteGenerationQuery,
  updateGenerationQuery,
} from '@/lib/db/features/organization/queries'
import type { SaveGenerationInput } from '@/lib/db/features/organization/types'

function parsePayload(formData: FormData): SaveGenerationInput {
  const raw = formData.get('payload')
  if (typeof raw !== 'string') throw new Error('Dữ liệu album không hợp lệ.')
  const payload = JSON.parse(raw) as SaveGenerationInput

  if (!payload.name?.trim()) throw new Error('Tên thế hệ không được để trống.')
  if (!payload.slug?.trim()) throw new Error('Slug không được để trống.')
  if (!Array.isArray(payload.departments)) payload.departments = []
  if (payload.departments.some((department) => !department.name?.trim())) {
    throw new Error('Tên phòng ban không được để trống.')
  }

  return payload
}

export async function saveGenerationAction(_previousState: unknown, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) return { error: 'Bạn không có quyền thực hiện hành động này.' }

  try {
    const payload = parsePayload(formData)
    const idValue = formData.get('id')
    const id = typeof idValue === 'string' && idValue ? Number(idValue) : undefined

    if (id && Number.isFinite(id)) await updateGenerationQuery(id, payload)
    else await createGenerationQuery(payload)

    revalidatePath('/about')
    revalidatePath('/admin/generations')
  } catch (error) {
    console.error('Failed to save generation:', error)
    return { error: error instanceof Error ? error.message : 'Không thể lưu album thế hệ.' }
  }

  redirect('/admin/generations')
}

export async function deleteGenerationAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) throw new Error('Unauthorized')
  await deleteGenerationQuery(id)
  revalidatePath('/about')
  revalidatePath('/admin/generations')
}

export async function syncManageUsersAction() {
  const session = await getAdminSession()
  if (!session.authenticated) throw new Error('Unauthorized')
  await getManageUsers({ forceRefresh: true })
  revalidatePath('/admin/generations')
  redirect('/admin/generations?synced=1')
}
