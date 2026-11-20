import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isTokenValid, SSO_LOGIN_URL } from '@/lib/auth-sso'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // 1. Bypass static files, Next.js internal assets, and public APIs
  const isStaticOrInternal =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/api/og') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'

  if (isStaticOrInternal) {
    return NextResponse.next()
  }

  // 2. Determine route classification
  const isLoginPage = pathname === '/admin/login'
  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/settings')

  const hasValidToken = isTokenValid(token)

  // 3. Handle login page visits
  if (isLoginPage) {
    // If already authenticated with a valid token, redirect to admin home
    if (hasValidToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // Allow request to proceed so user can see SSO login button or fallback
    return NextResponse.next()
  }

  // 4. Handle protected routes
  if (isProtectedRoute) {
    // If unauthenticated or token is expired, redirect to central SSO portal
    if (!hasValidToken) {
      const loginUrl = new URL(SSO_LOGIN_URL)
      loginUrl.searchParams.set('redirect', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 5. Public routes allow unrestricted access
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
