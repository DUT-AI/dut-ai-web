import { test, expect } from '@playwright/test'
import { clearAuthCookies, setMockAuthCookie } from './fixtures/auth.fixture'

test.describe('RBAC Route Partitioning & Guard Enforcement', () => {
  test.beforeEach(async ({ context }) => {
    await clearAuthCookies(context)
  })

  test('Unauthenticated visitor navigating to /admin is redirected to /admin/login', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL('**/admin/login**')
    expect(page.url()).toContain('/admin/login')
  })

  test('Unauthenticated visitor navigating to /admin/blogs is redirected to /admin/login', async ({ page }) => {
    await page.goto('/admin/blogs')
    await page.waitForURL('**/admin/login**')
    expect(page.url()).toContain('/admin/login')
  })

  test('Unauthenticated visitor navigating to /admin/portfolio is redirected to /admin/login', async ({ page }) => {
    await page.goto('/admin/portfolio')
    await page.waitForURL('**/admin/login**')
    expect(page.url()).toContain('/admin/login')
  })

  test('/admin/login page renders login options cleanly without errors', async ({ page }) => {
    await page.goto('/admin/login')

    const main = page.locator('main, form, [data-testid="login-container"]').first()
    await expect(main).toBeVisible()
  })
})
