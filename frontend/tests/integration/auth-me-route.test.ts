import test from 'node:test'
import assert from 'node:assert/strict'
import { GET } from '../../app/api/auth/me/route'
import { createMockRequest, withMockCookies } from './helpers/mock-request'

test('GET /api/auth/me returns 401 when no session cookies or tokens exist', async () => {
  const req = createMockRequest('http://localhost:3000/api/auth/me')

  const res = await withMockCookies({}, () => GET(req))
  assert.equal(res.status, 401)

  const body = await res.json()
  assert.equal(body.is_success, false)
  assert.equal(body.status_code, 401)
  assert.equal(body.data, null)
})

test('GET /api/auth/me returns 401 when token is expired or malformed', async () => {
  const req = createMockRequest('http://localhost:3000/api/auth/me')

  const res = await withMockCookies(
    { dutai_access_token: 'malformed-or-expired-token' },
    () => GET(req)
  )
  assert.equal(res.status, 401)

  const body = await res.json()
  assert.equal(body.is_success, false)
})
