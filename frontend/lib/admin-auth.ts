import { cookies } from 'next/headers'
import { UserRole } from './enums/roles'

export interface AdminUserData {
  id?: number | string
  name: string
  email: string
  status?: string
  avatar_url?: string
  avatar?: string
  roles?: (UserRole | string)[]
  role_names?: (UserRole | string)[]
  is_deleted?: boolean
}

export interface AdminSession {
  accessToken: string
  refreshToken?: string
  user: AdminUserData
}

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const ADMIN_USER_COOKIE = 'dut_admin_user'
const SESSION_COOKIE = 'dut_admin_session'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const AUTH_ME_URL = 'https://manage.dutai.io.vn/api/v1/auth/me'

export async function createAdminSession(data: {
  accessToken: string
  refreshToken?: string
  user: AdminUserData
}) {
  const cookieStore = await cookies()

  // 1. Lưu access_token & refresh_token
  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  if (data.refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
  }

  // 2. Lưu thông tin admin user
  cookieStore.set(ADMIN_USER_COOKIE, JSON.stringify(data.user), {
    httpOnly: false, // Để client/UI có thể hiển thị name, avatar, role
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  // 3. Đánh dấu session middleware
  cookieStore.set(SESSION_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
  cookieStore.delete(ADMIN_USER_COOKIE)
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Gọi API https://manage.dutai.io.vn/api/v1/auth/me bằng access_token để lấy thông tin user mới nhất
 * Loại bỏ permissions khỏi dữ liệu trả về theo yêu cầu.
 */
export async function fetchCurrentUser(accessToken: string): Promise<AdminUserData | null> {
  try {
    const res = await fetch(AUTH_ME_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    if (data?.is_success && data?.data) {
      const u = data.data
      // Lấy tất cả thông tin ngoại trừ permissions
      const userData: AdminUserData = {
        id: u.id,
        name: u.name,
        email: u.email,
        status: u.status,
        avatar_url: u.avatar_url,
        avatar: u.avatar_url || u.avatar,
        roles: u.role_names || u.roles || [],
        role_names: u.role_names || u.roles || [],
        is_deleted: u.is_deleted,
      }
      return userData
    }
    return null
  } catch (err) {
    console.error('Error fetching current user from auth/me:', err)
    return null
  }
}

export async function getAdminSession(forceRefresh: boolean = false): Promise<{
  authenticated: boolean
  accessToken?: string
  user?: AdminUserData
}> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  const sessionFlag = cookieStore.get(SESSION_COOKIE)?.value
  const userJson = cookieStore.get(ADMIN_USER_COOKIE)?.value

  if (!accessToken && !sessionFlag) {
    return { authenticated: false }
  }

  let user: AdminUserData | undefined = undefined

  if (userJson && !forceRefresh) {
    try {
      user = JSON.parse(userJson)
    } catch {
      user = undefined
    }
  }

  // Nếu chưa có user trong cookie hoặc yêu cầu forceRefresh, gọi API /auth/me
  if ((!user || forceRefresh) && accessToken) {
    const freshUser = await fetchCurrentUser(accessToken)
    if (freshUser) {
      user = freshUser
      // Cập nhật cookie user mới nhất
      cookieStore.set(ADMIN_USER_COOKIE, JSON.stringify(freshUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
      })
    }
  }

  return {
    authenticated: true,
    accessToken,
    user,
  }
}
