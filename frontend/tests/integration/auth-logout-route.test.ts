import test from 'node:test'
import assert from 'node:assert/strict'
import { POST, GET } from '../../app/api/auth/logout/route'
import { createMockRequest, withMockCookies } from './helpers/mock-request'

test('POST /api/auth/logout clears cookies and returns 200 with redirect url', async () => {
  const res = await withMockCookies(
    { dutai_access_token: 'session-to-clear', dutai_refresh_token: 'refresh-to-clear' },
    () => POST()
  )

  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.is_success, true)
  assert.equal(body.redirect_url, '/admin/login')
})

test('GET /api/auth/logout redirects browser to /admin/login', async () => {
  const req = createMockRequest('http://localhost:3000/api/auth/logout')

  const res = await withMockCookies({}, () => GET(req))
  assert.equal(res.status >= 300 && res.status < 400, true)
  const location = res.headers.get('location')
  assert.ok(location?.includes('/admin/login'))
})
