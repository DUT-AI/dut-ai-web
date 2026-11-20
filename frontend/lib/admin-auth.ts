import { cookies } from 'next/headers'
import {
  fetchCurrentSsoUser,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_MAX_AGE,
  getSsoCookieOptions,
  DutAiUserProfile,
} from './auth-sso'
import { getSsoServerSession } from './auth-sso-server'
import { hasContentAccess } from './enums/roles'

/**
 * Thống nhất dùng chung DutAiUserProfile từ hệ thống SSO.
 * Giữ alias AdminUserData để tương thích ngược 100%.
 */
export type AdminUserData = DutAiUserProfile

export interface AdminSession {
  authenticated: boolean
  accessToken?: string
  refreshToken?: string
  user?: DutAiUserProfile
}

export async function createAdminSession(data: {
  accessToken: string
  refreshToken?: string
  user: DutAiUserProfile
}) {
  const cookieStore = await cookies()
  const cookieOpts = getSsoCookieOptions()

  // Lưu access_token & refresh_token với cấu hình domain dùng chung
  cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    ...cookieOpts,
    maxAge: SESSION_MAX_AGE,
  })

  if (data.refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
      ...cookieOpts,
      maxAge: SESSION_MAX_AGE,
    })
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  const logoutOpts = getSsoCookieOptions(true)

  // Xóa cookie SSO toàn hệ thống .dutai.io.vn
  cookieStore.set(ACCESS_TOKEN_COOKIE, '', logoutOpts)
  cookieStore.set(REFRESH_TOKEN_COOKIE, '', logoutOpts)

  // Dọn sạch cookie legacy cũ nếu trình duyệt còn lưu
  cookieStore.delete('dut_admin_user')
  cookieStore.delete('dut_admin_session')
}

/**
 * Gọi API xác thực thông qua shared SSO IdP helper
 */
export async function fetchCurrentUser(accessToken: string): Promise<DutAiUserProfile | null> {
  return await fetchCurrentSsoUser(accessToken)
}

/**
 * Đọc phiên admin phía server.
 * Ủy quyền trực tiếp cho getSsoServerSession để đảm bảo duy nhất 1 nguồn sự thật (Single Source of Truth).
 */
export async function getAdminSession(): Promise<AdminSession> {
  const session = await getSsoServerSession()

  return {
    authenticated: session.isAuthenticated,
    accessToken: session.accessToken || undefined,
    refreshToken: session.refreshToken || undefined,
    user: session.user || undefined,
  }
}

/**
 * Server guard yêu cầu người dùng phải có quyền Quản lý nội dung (role Content hoặc admin).
 * Dùng cho tất cả Server Actions và Mutation endpoints của blogs, projects, events,...
 *
 * @throws Error('UNAUTHORIZED') nếu chưa đăng nhập
 * @throws Error('FORBIDDEN_CONTENT_ROLE_REQUIRED') nếu không có quyền Content/Admin
 */
export async function requireContentSession(): Promise<AdminSession> {
  const session = await getAdminSession()

  if (!session.authenticated || !session.user) {
    throw new Error('UNAUTHORIZED')
  }

  if (!hasContentAccess(session.user)) {
    throw new Error('FORBIDDEN_CONTENT_ROLE_REQUIRED')
  }

  return session
}
