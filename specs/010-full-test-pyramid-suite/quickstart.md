# Developer Quickstart: Running Test Suites

**Feature**: `010-full-test-pyramid-suite`  
**Date**: 2026-11-21

## 1. Quick Commands

All test commands are run from the `frontend/` directory (or root via npm workspace):

```bash
cd frontend

# 1. Run standard unit & integration tests (fast, < 5s)
npm run test

# 2. Run only Unit tests
npm run test:unit

# 3. Run Unit tests in watch mode during development
npm run test:watch

# 4. Run only API Integration tests
npm run test:integration

# 5. Run Playwright End-to-End tests (Headless)
npm run test:e2e

# 6. Run Playwright E2E tests with UI mode / visual browser
npx playwright test --ui

# 7. Run full test suite (Unit + Integration + E2E)
npm run test:all
```

## 2. Prerequisites for E2E Tests

1. Ensure the development server is running, or allow Playwright's `webServer` config to launch it automatically on port 3000.
2. The development database should be running (e.g. local PostgreSQL container or Supabase instance matching `.env.local`).
3. First-time Playwright browser install (if not already cached):
   ```bash
   npx playwright install --with-deps chromium
   ```

## 3. Writing New Tests

### Unit Tests (`tests/unit/<domain>.test.ts`)
```typescript
import test from 'node:test'
import assert from 'node:assert/strict'

test('domain feature behavior', () => {
  assert.strictEqual(myFunction('input'), 'expected')
})
```

### Integration Tests (`tests/integration/<endpoint>.test.ts`)
```typescript
import test from 'node:test'
import assert from 'node:assert/strict'
import { GET } from '@/app/api/blogs/route'

test('GET /api/blogs returns 200', async () => {
  const res = await GET(new Request('http://localhost:3000/api/blogs'))
  assert.strictEqual(res.status, 200)
})
```

### E2E Tests (`tests/e2e/<flow>.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('public homepage displays hero title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
```
