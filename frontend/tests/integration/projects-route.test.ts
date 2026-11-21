import test from 'node:test'
import assert from 'node:assert/strict'
import { OPTIONS, POST } from '../../app/api/projects/route'
import { NextRequest } from 'next/server'

test('OPTIONS /api/projects returns 204 with CORS headers', async () => {
  const res = await OPTIONS()
  assert.equal(res.status, 204)
  assert.equal(res.headers.get('access-control-allow-methods')?.includes('POST'), true)
})

test('POST /api/projects rejects request when title is missing', async () => {
  const req = new NextRequest('http://localhost:3000/api/projects', {
    method: 'POST',
    body: JSON.stringify({ description: 'A project without title' }),
    headers: { 'content-type': 'application/json' },
  })

  const res = await POST(req)
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error, 'Title is required')
})
