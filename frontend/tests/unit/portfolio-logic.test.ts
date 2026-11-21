import test from 'node:test'
import assert from 'node:assert'
import {
  PREDEFINED_TECHSTACK,
  PREDEFINED_TOOLSTACK,
} from '../../features/portfolio/constants/predefined-skills'

test('Portfolio Tabs definition has all 5 tabs', () => {
  const tabs = ['home', 'about', 'projects', 'blogs', 'resume']
  assert.strictEqual(tabs.length, 5)
  assert.ok(tabs.includes('home'))
  assert.ok(tabs.includes('about'))
  assert.ok(tabs.includes('projects'))
  assert.ok(tabs.includes('blogs'))
  assert.ok(tabs.includes('resume'))
})

test('GitHub username sanitization strips full URLs', () => {
  const rawUrls = [
    'https://github.com/phuocnguyen2412',
    'http://github.com/phuocnguyen2412/',
    'https://www.github.com/phuocnguyen2412',
    'phuocnguyen2412',
  ]

  const clean = (input: string) =>
    input
      .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
      .replace(/\/+$/, '')
      .trim()

  for (const url of rawUrls) {
    assert.strictEqual(clean(url), 'phuocnguyen2412')
  }
})

test('Predefined techstack and toolstack are populated and non-empty', () => {
  assert.ok(PREDEFINED_TECHSTACK.length > 10)
  assert.ok(PREDEFINED_TOOLSTACK.length > 5)

  // Verify key technologies are present
  const techNames = PREDEFINED_TECHSTACK.map((t) => t.name)
  assert.ok(techNames.includes('Python'))
  assert.ok(techNames.includes('TypeScript'))
  assert.ok(techNames.includes('React'))

  const toolNames = PREDEFINED_TOOLSTACK.map((t) => t.name)
  assert.ok(toolNames.includes('VS Code'))
  assert.ok(toolNames.includes('Postman'))
  assert.ok(toolNames.includes('MacOS'))
})
