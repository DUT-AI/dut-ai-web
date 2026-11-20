import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getSsoCookieOptions,
  SSO_LOGIN_URL,
} from '@/lib/auth-sso'

/**
 * Single Sign-Out (SLO) endpoint:
 * Invalidate shared cookies across .dutai.io.vn with Max-Age=0
 */
export async function POST() {
  const cookieStore = await cookies()
  const logoutOpts = getSsoCookieOptions(true)

  // 1. Clear cross-subdomain shared SSO cookies
  cookieStore.set(ACCESS_TOKEN_COOKIE, '', logoutOpts)
  cookieStore.set(REFRESH_TOKEN_COOKIE, '', logoutOpts)

  // 2. Clear legacy local cookies
  cookieStore.delete('dut_admin_session')
  cookieStore.delete('dut_admin_user')

  return NextResponse.json({
    is_success: true,
    message: 'Đăng xuất thành công',
    redirect_url: SSO_LOGIN_URL,
  })
}

/**
 * Direct browser GET navigation for logout (e.g. bookmarks or direct links)
 */
export async function GET() {
  const cookieStore = await cookies()
  const logoutOpts = getSsoCookieOptions(true)

  cookieStore.set(ACCESS_TOKEN_COOKIE, '', logoutOpts)
  cookieStore.set(REFRESH_TOKEN_COOKIE, '', logoutOpts)
  cookieStore.delete('dut_admin_session')
  cookieStore.delete('dut_admin_user')

  return NextResponse.redirect(new URL(SSO_LOGIN_URL))
}
