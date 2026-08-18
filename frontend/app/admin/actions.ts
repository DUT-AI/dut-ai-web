'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createAdminSession, clearAdminSession, fetchCurrentUser, AdminUserData } from '@/lib/admin-auth'

const AUTH_LOGIN_URL = 'https://manage.dutai.io.vn/api/v1/auth/login'

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('binary')
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export async function loginAdminAction(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim() || (formData.get('username') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return {
      error: 'Vui lòng nhập đầy đủ Email và Mật khẩu',
    }
  }

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

    // Forward bất kỳ cookie nào server trả về
    const cookieStore = await cookies()
    const setCookieHeader = res.headers.get('set-cookie')
    if (setCookieHeader) {
      const rawCookies = setCookieHeader.split(/,(?=[^;]+=[^;]+)/)
      for (const raw of rawCookies) {
        const parts = raw.split(';')[0]?.trim()
        if (parts) {
          const [name, ...valParts] = parts.split('=')
          const value = valParts.join('=')
          if (name && value) {
            cookieStore.set(name.trim(), value.trim(), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            })
          }
        }
      }
    }

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

    // 1. Gọi /api/v1/auth/me để lấy profile user chính xác nhất (không bao gồm permissions)
    let adminUser = await fetchCurrentUser(accessToken)

    // 2. Fallback sang JWT payload nếu fetchCurrentUser không thành công
    if (!adminUser) {
      const jwtPayload = parseJwt(accessToken) || {}
      adminUser = {
        id: jwtPayload.sub || '1',
        name: jwtPayload.name || email,
        email: jwtPayload.email || email,
        roles: jwtPayload.roles || ['admin'],
        role_names: jwtPayload.roles || ['admin'],
        avatar: jwtPayload.avatar || '',
        avatar_url: jwtPayload.avatar || '',
        status: 'ACTIVE',
      }
    }

    // Lưu session & token
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

  redirect('/admin')
}

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect('/admin/login')
}

/**
 * Server Action để lấy thông tin user hiện tại (thông qua /auth/me nếu có token)
 */
export async function getMeAction() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  if (!accessToken) return null

  return await fetchCurrentUser(accessToken)
}
