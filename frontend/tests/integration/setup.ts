import { AsyncLocalStorage } from 'node:async_hooks'

// Ensure global AsyncLocalStorage is registered before Next.js server runtime evaluates
if (typeof (globalThis as any).AsyncLocalStorage === 'undefined') {
  ;(globalThis as any).AsyncLocalStorage = AsyncLocalStorage
}
