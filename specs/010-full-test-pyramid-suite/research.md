# Research & Technology Decisions: Full Test Pyramid Suite

**Feature**: `010-full-test-pyramid-suite`  
**Date**: 2026-11-21

## 1. Test Runner Selection: Native `node:test` + `tsx` vs Vitest/Jest

### Context
DUT-AI Web has a modern ESM-first stack with Next.js 16 and React 19. We evaluated whether to introduce a heavy testing framework (Vitest, Jest) or leverage the Node.js built-in test runner via `tsx`.

### Decision
Use **`node:test` + `node:assert/strict` executed via `tsx --test`** for Unit and Integration tests.

### Rationale
1. **Zero Weight / Instant Startup**: Node.js has native test runner support since v18 (`node:test`). `tsx` handles TypeScript transpilation without bundling overhead.
2. **Execution Speed**: 17 unit tests execute in ~700ms. No waiting for Jest / Vitest daemon spin-up.
3. **No Config Sprawl**: Zero extra config files (`jest.config.js`, `vitest.config.ts`, `babel.config.js`). It just runs.
4. **Standard Assertions**: Built-in `assert.strictEqual`, `assert.deepStrictEqual`, `assert.ok`, `assert.rejects`.

---

## 2. Integration Testing Next.js App Router Route Handlers

### Context
In Next.js App Router (`app/api/**/route.ts`), route handlers are standard exported async functions:
```ts
export async function GET(request: Request): Promise<Response>
```

### Decision
Test route handlers by invoking them directly with native `Request` or `NextRequest` objects in `tsx --test`.

### Pattern
```ts
import { GET } from '@/app/api/blogs/route'

test('GET /api/blogs returns published posts', async () => {
  const req = new Request('http://localhost:3000/api/blogs?limit=5')
  const res = await GET(req)
  assert.strictEqual(res.status, 200)
  const data = await res.json()
  assert.ok(Array.isArray(data.posts || data.items || data))
})
```

### Rationale
- Completely eliminates the need for Supertest or booting up an HTTP server.
- High speed, deterministic, and tests the exact same handler logic that Next.js invokes.

---

## 3. Playwright E2E Setup & Dev Database Integration

### Context
The user requested that E2E tests run against the current development database (`.env.local`).

### Strategy & Safety Measures
1. **Server Target**:
   - Playwright's `webServer` option in `playwright.config.ts` connects to `http://localhost:3000` (reusing an existing dev server if already running via `reuseExistingServer: !process.env.CI`).
2. **Read-only Journeys**:
   - All public browsing tests (Home, Blog, Events, Projects) are strictly read-only. They assert on real data in the database (e.g. at least 1 post or header element rendered).
3. **RBAC Verification**:
   - Playwright context cookies can be pre-set with `accessToken` containing a valid JWT payload or fallback token to simulate:
     - `Content` admin role: access `/admin/blogs`
     - `Member` role: access `/admin/portfolio`, redirect when visiting `/admin/blogs`
     - Unauthenticated: redirect to `/admin/login`
4. **Mutation Safety**:
   - Any test that creates temporary records will prefix them with `[E2E-TEST]` and delete them in `afterAll()` hooks using Drizzle ORM queries directly, leaving the dev DB pristine.
