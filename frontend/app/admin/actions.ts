'use server'

import { redirect } from 'next/navigation'
import { createAdminSession, clearAdminSession, fetchCurrentUser } from '@/lib/admin-auth'
import {
  DUTAI_MANAGE_API_URL,
  SSO_LOGIN_URL,
  decodeJwtPayload,
  DutAiUserProfile,
} from '@/lib/auth-sso'
import { hasContentAccess } from '@/lib/enums/roles'

const AUTH_LOGIN_URL = `${DUTAI_MANAGE_API_URL}/api/v1/auth/login`

export async function loginAdminAction(prevState: any, formData: FormData) {
  const email =
    (formData.get('email') as string)?.trim() || (formData.get('username') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()
  const redirectTarget = (formData.get('redirect') as string)?.trim()

  if (!email || !password) {
    return {
      error: 'Vui lòng nhập đầy đủ Email và Mật khẩu',
    }
  }

  let adminUser: DutAiUserProfile | null = null

  try {
    const res = await fetch(AUTH_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
      cache: 'no-store',
    })

    const resData = await res.json().catch(() => null)

    if (!res.ok || !resData || !resData.is_success) {
      const message = resData?.message || resData?.detail || 'Sai tài khoản hoặc mật khẩu'
      return {
        error: typeof message === 'string' ? message : 'Đăng nhập không thành công',
      }
    }

    const tokenData = resData.data
    const accessToken = tokenData?.access_token
    const refreshToken = tokenData?.refresh_token

    if (!accessToken) {
      return {
        error: 'Không nhận được token xác thực từ máy chủ',
      }
    }

    adminUser = await fetchCurrentUser(accessToken)

    if (!adminUser) {
      return {
        error: 'Không thể xác thực thông tin tài khoản với máy chủ quản trị DUT-AI',
      }
    }

    await createAdminSession({
      accessToken,
      refreshToken,
      user: adminUser,
    })
  } catch (err: any) {
    console.error('Login error:', err)
    return {
      error: err?.message || 'Có lỗi kết nối tới máy chủ xác thực. Vui lòng thử lại sau.',
    }
  }

  let destination = redirectTarget && redirectTarget.startsWith('/') ? redirectTarget : '/admin'
  if (destination === '/admin' && !hasContentAccess(adminUser)) {
    destination = '/admin/portfolio'
  }
  return { success: true, redirect: destination }
}

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect('/admin/login')
}
