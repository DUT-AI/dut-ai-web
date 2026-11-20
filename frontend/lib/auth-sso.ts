import { cache } from 'react'

// ==========================================
// 1. SSO Constants & Configurations
// ==========================================

export const SSO_LOGIN_URL =
  process.env.NEXT_PUBLIC_SSO_LOGIN_URL || 'https://workspace.dutai.io.vn/login'

export const DUTAI_MANAGE_API_URL = process.env.DUTAI_MANAGE_API_URL || 'https://manage.dutai.io.vn'

export const SSO_COOKIE_DOMAIN = process.env.SSO_COOKIE_DOMAIN || '.dutai.io.vn'

export const ACCESS_TOKEN_COOKIE = 'access_token'
export const REFRESH_TOKEN_COOKIE = 'refresh_token'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ==========================================
// 2. Types & Interfaces (Standardized on IdP schema)
// ==========================================

export interface DutAiUserProfile {
  id: number | string
  name: string
  email: string
  avatar_url?: string | null
  role_names: string[]
  permissions: string[]
  status?: string
  is_deleted?: boolean
}

export interface JwtTokenPayload {
  sub?: string | number
  email?: string
  name?: string
  avatar_url?: string
  avatar?: string
  exp?: number
  iat?: number
  role_names?: string[]
  roles?: string[]
  permissions?: string[]
  iss?: string
  aud?: string | string[]
  [key: string]: unknown
}

export interface SsoSession {
  accessToken: string | null
  refreshToken?: string | null
  user: DutAiUserProfile | null
  isAuthenticated: boolean
  expiresAt?: number | null
}

export interface SsoCookieOptions {
  domain?: string
  path: string
  maxAge: number
  httpOnly: boolean
  sameSite: 'lax' | 'strict' | 'none'
  secure: boolean
}

// ==========================================
// 3. JWT & Token Validation Helpers
// ==========================================

/**
 * Lightweight Base64 JWT payload decoder that executes without crypto libraries,
 * making it safe and fast for Edge runtime (Next.js Middleware) and Client Components.
 */
export function decodeJwtPayload(token: string): JwtTokenPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    let decodedStr = ''
    if (typeof atob === 'function') {
      decodedStr = atob(base64)
    } else if (typeof Buffer !== 'undefined') {
      decodedStr = Buffer.from(base64, 'base64').toString('utf8')
    } else {
      return null
    }

    return JSON.parse(decodedStr) as JwtTokenPayload
  } catch {
    return null
  }
}

/**
 * Validates whether a token exists and has not yet expired.
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false
  const payload = decodeJwtPayload(token)
  if (!payload) return false

  if (payload.exp) {
    const currentEpochSeconds = Math.floor(Date.now() / 1000)
    return payload.exp > currentEpochSeconds
  }

  return true
}

// ==========================================
// 4. Cookie Domain & Environment Helpers
// ==========================================

/**
 * Resolves cookie options according to environment.
 * In production or DUT-AI subdomains, binds cookies to `.dutai.io.vn`.
 * In localhost development, omits domain to prevent browser rejection.
 */
export function getSsoCookieOptions(isLogout = false): SsoCookieOptions {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    domain: isProd ? SSO_COOKIE_DOMAIN : undefined,
    path: '/',
    maxAge: isLogout ? 0 : SESSION_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
  }
}

// ==========================================
// 5. Central IdP User Profile Fetcher
// ==========================================

/**
 * Calls the DUT-AI central IdP to fetch user profile, roles, and permissions.
 * Wrapped in React cache() to deduplicate requests within a single SSR render cycle.
 */
export const fetchCurrentSsoUser = cache(
  async (accessToken: string): Promise<DutAiUserProfile | null> => {
    if (!accessToken || !isTokenValid(accessToken)) {
      return null
    }

    const endpoint = `${DUTAI_MANAGE_API_URL}/api/v1/auth/me`

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Cookie: `access_token=${accessToken}`,
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        return null
      }

      const body = await res.json()
      const data = body?.data || body

      if (!data || typeof data !== 'object') {
        return null
      }

      const roleNames: string[] = Array.isArray(data.role_names)
        ? data.role_names
        : Array.isArray(data.roles)
          ? data.roles
          : []

      const permissions: string[] = Array.isArray(data.permissions) ? data.permissions : []

      const profile: DutAiUserProfile = {
        id: data.id ?? '0',
        name: data.name || data.email || 'DUT AI Member',
        email: data.email || '',
        avatar_url: data.avatar_url || data.avatar || null,
        role_names: roleNames,
        permissions: permissions,
        status: data.status || 'ACTIVE',
        is_deleted: Boolean(data.is_deleted),
      }

      return profile
    } catch (error) {
      console.error('[SSO] Error fetching user profile from IdP:', error)
      return null
    }
  }
)
