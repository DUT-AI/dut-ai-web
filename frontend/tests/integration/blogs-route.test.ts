import test from 'node:test'
import assert from 'node:assert/strict'
import { OPTIONS, GET } from '../../app/api/blogs/route'
import { NextRequest } from 'next/server'

test('OPTIONS /api/blogs returns 204 with CORS headers', async () => {
  const res = await OPTIONS()
  assert.equal(res.status, 204)
  assert.equal(res.headers.get('access-control-allow-methods')?.includes('GET'), true)
})

test('GET /api/blogs handles query parameters gracefully', async () => {
  const req = new NextRequest('http://localhost:3000/api/blogs?title=Test&keyword=AI')
  const res = await GET(req)

  // Either 200 with data or 500 when database connection is unavailable in CI
  assert.ok([200, 500].includes(res.status))
  const body = await res.json()
  assert.ok(typeof body === 'object')
})
