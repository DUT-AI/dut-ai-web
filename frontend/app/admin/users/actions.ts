'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createUserQuery,
  updateUserQuery,
  deleteUserQuery,
} from '@/lib/db/features/users/queries'
import { getAdminSession } from '@/lib/admin-auth'

export async function saveUserAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phoneNumber = (formData.get('phoneNumber') as string)?.trim()
  const status = (formData.get('status') as string)?.trim() || 'active'
  const roleName = (formData.get('roleName') as string)?.trim() || 'Member'
  const roleIdStr = (formData.get('roleId') as string)?.trim()
  const roleId = roleIdStr ? parseInt(roleIdStr, 10) : undefined
  const avatarUrl = (formData.get('avatarUrl') as string)?.trim()
  const discordId = (formData.get('discordId') as string)?.trim()

  if (!name) {
    return { error: 'Họ tên thành viên không được để trống.' }
  }

  try {
    if (id) {
      await updateUserQuery(id, {
        name,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        status,
        roleName,
        roleId,
        avatarUrl: avatarUrl || undefined,
        discordId: discordId || undefined,
      })
    } else {
      await createUserQuery({
        name,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        status,
        roleName,
        roleId,
        avatarUrl: avatarUrl || undefined,
        discordId: discordId || undefined,
      })
    }

    revalidateTag('members', 'homepage')
  } catch (error: any) {
    console.error('Failed to save user:', error)
    return { error: error?.message || 'Lỗi khi lưu thông tin thành viên.' }
  }

  redirect('/admin/users')
}

export async function deleteUserAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('Unauthorized')
  }

  await deleteUserQuery(id)
  revalidateTag('members', 'homepage')
  redirect('/admin/users')
}
