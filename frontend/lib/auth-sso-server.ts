import { cookies } from 'next/headers'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  isTokenValid,
  decodeJwtPayload,
  fetchCurrentSsoUser,
  SsoSession,
} from './auth-sso'

/**
 * Resolves the active SSO session in Server Components and Route Handlers.
 * Server-only utility using next/headers.
 */
export async function getSsoServerSession(): Promise<SsoSession> {
  const cookieStore = await cookies()
  const accessToken =
    cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ||
    (process.env.NODE_ENV !== 'production' ? process.env.DEV_FALLBACK_ACCESS_TOKEN : undefined) ||
    null

  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null

  if (!accessToken || !isTokenValid(accessToken)) {
    return {
      accessToken: null,
      refreshToken,
      user: null,
      isAuthenticated: false,
      expiresAt: null,
    }
  }

  const payload = decodeJwtPayload(accessToken)
  const user = await fetchCurrentSsoUser(accessToken)

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: Boolean(user),
    expiresAt: payload?.exp || null,
  }
}
