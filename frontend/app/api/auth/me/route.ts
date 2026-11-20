import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE, fetchCurrentSsoUser, isTokenValid } from '@/lib/auth-sso'

export async function GET(request: Request) {
  const cookieStore = await cookies()

  // 1. Get access token from shared cookie
  let accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  // 2. Localhost development fallback if no cookie is set in browser
  if (!accessToken && process.env.NODE_ENV !== 'production') {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7)
    } else {
      accessToken =
        request.headers.get('x-dev-access-token') || process.env.DEV_FALLBACK_ACCESS_TOKEN
    }
  }

  if (!accessToken) {
    return NextResponse.json(
      {
        is_success: false,
        status_code: 401,
        message: 'Chưa đăng nhập hoặc thiếu access_token',
        data: null,
      },
      { status: 401 }
    )
  }

  // 3. Fast Edge / Server token validity check
  if (!isTokenValid(accessToken)) {
    return NextResponse.json(
      {
        is_success: false,
        status_code: 401,
        message: 'Token đã hết hạn hoặc không hợp lệ',
        data: null,
      },
      { status: 401 }
    )
  }

  // 4. Retrieve authoritative user profile from Central IdP
  const user = await fetchCurrentSsoUser(accessToken)

  if (!user) {
    return NextResponse.json(
      {
        is_success: false,
        status_code: 401,
        message: 'Không thể xác thực phiên đăng nhập với máy chủ DUT-AI',
        data: null,
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    is_success: true,
    status_code: 200,
    data: user,
    message: 'Lấy thông tin người dùng thành công',
  })
}
