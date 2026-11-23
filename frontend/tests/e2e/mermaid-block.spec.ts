import { randomUUID } from 'node:crypto'
import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config({ path: '.env.local', quiet: true })
dotenv.config({ path: '../.env', quiet: true })

const classSource = 'classDiagram\n  class Customer {\n    +name: str\n  }\n  Customer --> Order'
const sequenceSource =
  'sequenceDiagram\n  actor User as Khách hàng\n  User->>API: POST /checkout\n  API-->>User: Thành công'
const flowSource = '%% A diagram without a language label\nflowchart LR\n  A[Start] --> B[Done]'
const markdown = [
  '```python\ndef example():\n  return "classDiagram"\n```',
  `\`\`\`\n${classSource}\n\`\`\``,
  `\`\`\`text\n${sequenceSource}\n\`\`\``,
  `\`\`\`\n${flowSource}\n\`\`\``,
  '```\nclassDiagram = "ordinary code, not a diagram"\n```',
].join('\n\n')

test.describe('automatic Mermaid blog blocks', () => {
  test.describe.configure({ mode: 'serial' })
  test.setTimeout(90000)
  const slug = `mermaid-e2e-${randomUUID()}`
  let sql: ReturnType<typeof postgres>
  let blogId: number | undefined

  test.beforeAll(async () => {
    const url = process.env.DATABASE_URL
    const host = url ? new URL(url).hostname : process.env.POSTGRES_HOST || 'localhost'
    if (!['localhost', '127.0.0.1', '::1', '[::1]'].includes(host)) {
      throw new Error('Mermaid browser fixtures require a local test database.')
    }
    sql = url
      ? postgres(url, { max: 1 })
      : postgres({
          host,
          port: Number(process.env.POSTGRES_PORT || 5432),
          database: process.env.POSTGRES_DB || 'dut-ai-web',
          username: process.env.POSTGRES_USER || 'dutai',
          password: process.env.POSTGRES_PASSWORD || 'dutai',
          max: 1,
        })
    const [blog] = await sql`
      INSERT INTO blogs (title, slug, summary, content)
      VALUES ('Mermaid browser test', ${slug}, 'Temporary browser test fixture', ${markdown})
      RETURNING id
    `
    blogId = blog.id
  })

  test.afterAll(async () => {
    try {
      if (blogId !== undefined) await sql`DELETE FROM blogs WHERE id = ${blogId} AND slug = ${slug}`
    } finally {
      await sql?.end()
    }
  })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            ;(window as any).__copiedMermaid = text
          },
        },
      })
    })
    await page.goto(`/blog/${slug}`)
    await expect(page.getByRole('region', { name: 'Khối sơ đồ Mermaid' })).toHaveCount(3, {
      timeout: 60000,
    })
  })

  test('detects mixed unlabelled diagrams and keeps ordinary/invalid code intact', async ({
    page,
  }) => {
    const blocks = page.getByRole('region', { name: 'Khối sơ đồ Mermaid' })
    await expect(blocks.first().getByRole('tab', { name: 'Code', exact: true })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect(blocks.first().locator('pre code')).toHaveText(classSource)
    await expect(page.locator('pre').filter({ hasText: 'def example()' })).toHaveCount(1)
    await expect(
      page.locator('pre').filter({ hasText: 'ordinary code, not a diagram' })
    ).toHaveCount(1)
    await expect(page.getByRole('img', { name: 'Sơ đồ Mermaid' })).toHaveCount(0)
  })

  test('renders independent SVGs and copies original source from either tab', async ({ page }) => {
    const blocks = page.getByRole('region', { name: 'Khối sơ đồ Mermaid' })
    for (let index = 0; index < 3; index++) {
      await blocks.nth(index).getByRole('tab', { name: 'Diagram', exact: true }).click()
      await expect(
        blocks.nth(index).getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')
      ).toBeVisible()
    }
    await blocks.first().getByRole('button', { name: 'Copy code', exact: true }).click()
    await expect.poll(() => page.evaluate(() => (window as any).__copiedMermaid)).toBe(classSource)
    await expect(blocks.first().getByText('Copied', { exact: true })).toBeVisible()
    await blocks.nth(1).getByRole('tab', { name: 'Code', exact: true }).click()
    await blocks.nth(1).getByRole('button', { name: 'Copy code', exact: true }).click()
    await expect
      .poll(() => page.evaluate(() => (window as any).__copiedMermaid))
      .toBe(sequenceSource)
  })

  test('expands the current view, switches tabs, and restores focus on Escape', async ({
    page,
  }) => {
    const block = page.getByRole('region', { name: 'Khối sơ đồ Mermaid' }).first()
    const expand = block.getByRole('button', { name: 'Phóng to block Mermaid' })
    await expand.click()
    const dialog = page.getByRole('dialog', { name: 'Mermaid — Xem phóng to' })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('pre code')).toHaveText(classSource)
    await dialog.getByRole('tab', { name: 'Diagram', exact: true }).click()
    await expect(dialog.getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')).toBeVisible()
    const expandedWidth = await dialog
      .locator('[role="img"] svg')
      .evaluate((svg) => svg.getBoundingClientRect().width)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(expand).toBeFocused()
    await expect(block.getByRole('tab', { name: 'Diagram', exact: true })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect(block.getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')).toBeVisible()
    const inlineWidth = await block
      .locator('[role="img"] svg')
      .evaluate((svg) => svg.getBoundingClientRect().width)
    expect(expandedWidth).toBeGreaterThan(inlineWidth)
  })

  test('supports keyboard tabs and rerenders when the theme changes', async ({ page }) => {
    const block = page.getByRole('region', { name: 'Khối sơ đồ Mermaid' }).first()
    await block.getByRole('tab', { name: 'Code', exact: true }).focus()
    await page.keyboard.press('ArrowLeft')
    await expect(block.getByRole('tab', { name: 'Diagram', exact: true })).toBeFocused()
    await expect(block.getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')).toBeVisible()

    await page.getByRole('button', { name: 'Theme switcher' }).click()
    await page.getByRole('menuitem', { name: 'Dark', exact: true }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(block.getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')).toBeVisible()
    const darkSvg = await block.locator('[role="img"]').innerHTML()

    await page.getByRole('button', { name: 'Theme switcher' }).click()
    await page.getByRole('menuitem', { name: 'Light', exact: true }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(block.getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')).toBeVisible()
    await expect.poll(() => block.locator('[role="img"]').innerHTML()).not.toBe(darkSvg)
  })

  test('live editor preview detects, renders, and updates unlabelled diagrams', async ({
    page,
  }) => {
    const { build } = await import('esbuild')
    // Exercise the real editor independently of the admin's external SSO service.
    const bundle = await build({
      stdin: {
        contents: `
          import React, { useState } from 'react';
          import { createRoot } from 'react-dom/client';
          import { ThemeProvider } from 'next-themes';
          import MarkdownEditor from './features/blog/components/MarkdownEditor';
          function Preview() {
            const [value, setValue] = useState(${JSON.stringify(markdown)});
            return <ThemeProvider attribute="class"><MarkdownEditor value={value} onChange={setValue} /></ThemeProvider>;
          }
          createRoot(document.getElementById('root')).render(<Preview />);
        `,
        resolveDir: process.cwd(),
        loader: 'tsx',
      },
      bundle: true,
      write: false,
      format: 'iife',
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' },
    })
    await page.route('**/__mermaid_preview_bundle__.js', (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: bundle.outputFiles[0].text,
      })
    )
    await page.route('**/__mermaid_preview_test__', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><body><div id="root"></div><script src="/__mermaid_preview_bundle__.js"></script></body></html>',
      })
    )
    await page.goto('/__mermaid_preview_test__')
    const blocks = page.getByRole('region', { name: 'Khối sơ đồ Mermaid' })
    await expect(blocks).toHaveCount(3)
    await blocks.first().getByRole('tab', { name: 'Diagram', exact: true }).click()
    await expect(
      blocks.first().getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')
    ).toBeVisible()

    const textarea = page.getByRole('textbox')
    await textarea.fill('```python\nprint("classDiagram")\n```')
    await expect(blocks).toHaveCount(0)
    await textarea.fill('```\nflowchart LR\n  A[Changed] --> B[Preview]\n```')
    await expect(blocks).toHaveCount(1)
    await blocks.first().getByRole('tab', { name: 'Diagram', exact: true }).click()
    await expect(
      blocks.first().getByRole('img', { name: 'Sơ đồ Mermaid' }).locator('svg')
    ).toContainText('Changed')
  })
})
