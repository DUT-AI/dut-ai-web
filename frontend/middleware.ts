import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login'
    const sessionCookie =
      request.cookies.get('dut_admin_session')?.value ||
      request.cookies.get('access_token')?.value

    if (!sessionCookie && !isLoginPage) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }

    if (sessionCookie && isLoginPage) {
      const url = new URL('/admin', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
