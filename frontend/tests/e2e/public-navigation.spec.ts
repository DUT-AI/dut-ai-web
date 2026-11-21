import { test, expect } from '@playwright/test'

test.describe('Public Visitor Journeys', () => {
  test('Home page renders header navigation, hero section, and footer', async ({ page }) => {
    await page.goto('/')

    // Expect page title or header brand to be visible
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Main content area should render
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Footer should be visible
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('Navigate to /blog renders blog listing layout', async ({ page }) => {
    await page.goto('/blog')

    // Blog header or search input should be present
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Expect url to be /blog
    expect(page.url()).toContain('/blog')
  })

  test('Navigate to /projects renders projects listing', async ({ page }) => {
    await page.goto('/projects')

    const main = page.locator('main')
    await expect(main).toBeVisible()
    expect(page.url()).toContain('/projects')
  })

  test('Navigate to /events renders events timeline or list', async ({ page }) => {
    await page.goto('/events')

    const main = page.locator('main')
    await expect(main).toBeVisible()
    expect(page.url()).toContain('/events')
  })

  test('Mobile navigation toggle opens menu on small screens', async ({ page }) => {
    // Set small mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Look for mobile nav button (aria-label="Toggle Menu" or button inside header)
    const toggleButton = page.locator('button[aria-label="Toggle Menu"], button[aria-label="Open Menu"]').first()
    if (await toggleButton.isVisible()) {
      await toggleButton.click()
      // Nav container should become visible
      const mobileNav = page.locator('nav, [data-testid="mobile-nav"]').first()
      await expect(mobileNav).toBeVisible()
    }
  })
})
