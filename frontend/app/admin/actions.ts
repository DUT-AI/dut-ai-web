'use server'

import { redirect } from 'next/navigation'
import { createAdminSession, clearAdminSession } from '@/lib/admin-auth'

export async function loginAdminAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminPass = process.env.ADMIN_PASSWORD || 'admin'

  if (username?.trim() === adminUser && password?.trim() === adminPass) {
    await createAdminSession(username.trim())
    redirect('/admin')
  }

  return {
    error: 'Sai tài khoản hoặc mật khẩu quản trị',
  }
}

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect('/admin/login')
}
