import test from 'node:test'
import assert from 'node:assert/strict'
import { slug } from 'github-slugger'

test('slug correctly handles English phrases', () => {
  assert.equal(slug('Hello World Next.js 16'), 'hello-world-nextjs-16')
  assert.equal(slug('Building AI Applications'), 'building-ai-applications')
})

test('slug handles punctuation, multiple spaces, and special symbols', () => {
  assert.equal(slug('Deep Learning: A Practical Guide!'), 'deep-learning-a-practical-guide')
  assert.equal(slug('React 19 & Next.js -- Best Practices'), 'react-19--nextjs----best-practices')
})

test('slug generates url-safe strings suitable for blog paths', () => {
  const result = slug('DUT AI Club - GenAI Hackathon 2026')
  assert.match(result, /^[a-z0-9-]+$/)
  assert.equal(result.includes(' '), false)
})
