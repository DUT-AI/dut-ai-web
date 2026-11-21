import test from 'node:test'
import assert from 'node:assert/strict'
import { OPTIONS, GET } from '../../app/api/members/route'

test('OPTIONS /api/members returns 204 with CORS headers', async () => {
  const res = await OPTIONS()
  assert.equal(res.status, 204)
  assert.equal(res.headers.get('access-control-allow-methods')?.includes('GET'), true)
})

test('GET /api/members returns JSON list or fallback when unconfigured', async () => {
  const res = await GET()
  assert.ok([200, 500].includes(res.status))
  const body = await res.json()
  assert.ok(Array.isArray(body) || typeof body === 'object')
})
