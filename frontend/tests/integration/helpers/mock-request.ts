import { AsyncLocalStorage } from 'node:async_hooks'

// Ensure global AsyncLocalStorage is available before Next.js internals load
if (typeof (globalThis as any).AsyncLocalStorage === 'undefined') {
  ;(globalThis as any).AsyncLocalStorage = AsyncLocalStorage
}

/**
 * Helper to construct standard Web Request instances for testing
 * Next.js App Router Route Handlers.
 */
export function createMockRequest(
  url: string,
  options?: {
    method?: string
    headers?: Record<string, string>
    body?: any
    cookies?: Record<string, string>
  }
): Request {
  const headers = new Headers(options?.headers || {})

  if (options?.cookies) {
    const cookieHeader = Object.entries(options.cookies)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('; ')
    headers.set('cookie', cookieHeader)
  }

  if (options?.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  const reqInit: RequestInit = {
    method: options?.method || (options?.body ? 'POST' : 'GET'),
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  }

  return new Request(url, reqInit)
}

/**
 * Runs a route handler callback within Next.js request & cookies async context.
 * Enables testing route handlers that call `await cookies()`.
 */
export async function withMockCookies<T>(
  cookieMap: Record<string, string>,
  fn: () => Promise<T>
): Promise<T> {
  const { workAsyncStorage } = await import(
    'next/dist/server/app-render/work-async-storage.external.js'
  )
  const { workUnitAsyncStorage } = await import(
    'next/dist/server/app-render/work-unit-async-storage.external.js'
  )
  const { RequestCookies } = await import('next/dist/server/web/spec-extension/cookies.js')

  const headers = new Headers()
  const cookieHeader = Object.entries(cookieMap)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('; ')
  if (cookieHeader) {
    headers.set('cookie', cookieHeader)
  }
  const mockCookies = new RequestCookies(headers)

  return (workAsyncStorage as any).run({ route: '/api/test' }, () => {
    return (workUnitAsyncStorage as any).run(
      {
        type: 'request',
        phase: 'action',
        cookies: mockCookies,
        userspaceMutableCookies: mockCookies,
      },
      fn
    )
  })
}
