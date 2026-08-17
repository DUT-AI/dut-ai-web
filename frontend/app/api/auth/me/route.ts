import { NextResponse } from 'next/server'
import { getAdminSession, fetchCurrentUser } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.json(
      {
        is_success: false,
        status_code: 401,
        message: 'Chưa đăng nhập hoặc thiếu access_token',
      },
      { status: 401 }
    )
  }

  const user = await fetchCurrentUser(accessToken)

  if (!user) {
    return NextResponse.json(
      {
        is_success: false,
        status_code: 401,
        message: 'Token không hợp lệ hoặc đã hết hạn',
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
