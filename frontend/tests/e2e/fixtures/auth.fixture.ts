import { BrowserContext } from '@playwright/test'

export const ACCESS_TOKEN_COOKIE = 'dutai_access_token'
export const REFRESH_TOKEN_COOKIE = 'dutai_refresh_token'

/**
 * Injects a mock session cookie for E2E tests into the Playwright BrowserContext.
 */
export async function setMockAuthCookie(
  context: BrowserContext,
  role: 'Content' | 'Member' | 'Admin'
) {
  const token = `mock-e2e-token-${role.toLowerCase()}`
  await context.addCookies([
    {
      name: ACCESS_TOKEN_COOKIE,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])
}

/**
 * Clears authentication cookies to simulate unauthenticated state.
 */
export async function clearAuthCookies(context: BrowserContext) {
  await context.clearCookies()
}
