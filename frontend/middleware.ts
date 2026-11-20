import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isTokenValid, decodeJwtPayload, SSO_LOGIN_URL } from '@/lib/auth-sso'
import { hasContentAccess, getPartitionForPath } from '@/lib/enums/roles'

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
    // If already authenticated with a valid token, redirect to appropriate home
    if (hasValidToken) {
      const payload = decodeJwtPayload(token || '')
      const canAccessContent = hasContentAccess(payload?.role_names || payload?.roles)
      const destination = canAccessContent ? '/admin' : '/admin/portfolio'
      return NextResponse.redirect(new URL(destination, request.url))
    }
    // Allow request to proceed so user can see SSO login button or fallback
    return NextResponse.next()
  }

  // 4. Handle protected routes
  if (isProtectedRoute) {
    // If unauthenticated or token is expired, redirect to local admin login UI
    if (!hasValidToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based partitioning guard for Content Management Zone
    const partition = getPartitionForPath(pathname)
    if (partition === 'CONTENT_MANAGEMENT') {
      const payload = decodeJwtPayload(token || '')
      const canAccessContent = hasContentAccess(payload?.role_names || payload?.roles)

      if (!canAccessContent) {
        const redirectUrl = new URL('/admin/portfolio', request.url)
        redirectUrl.searchParams.set('denied', 'content')
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // 5. Public routes allow unrestricted access
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
