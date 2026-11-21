import test from 'node:test'
import assert from 'node:assert/strict'
import { hasContentAccess, getPartitionForPath, UserRole } from '../../lib/enums/roles'

test('hasContentAccess allows users with Content role (case-insensitive)', () => {
  // Role 'Content'
  assert.equal(hasContentAccess({ role_names: ['Content'] }), true)
  assert.equal(hasContentAccess({ role_names: ['content'] }), true)
  assert.equal(hasContentAccess({ role_names: ['CONTENT'] }), true)

  // Legacy roles fallback
  assert.equal(hasContentAccess({ roles: ['Content'] }), true)

  // Array of strings directly
  assert.equal(hasContentAccess(['Content']), true)
  assert.equal(hasContentAccess(['Member', 'Content', 'Educator']), true)
})

test('hasContentAccess allows admin role as superuser', () => {
  assert.equal(hasContentAccess({ role_names: ['admin'] }), true)
  assert.equal(hasContentAccess({ role_names: ['Admin'] }), true)
  assert.equal(hasContentAccess({ role_names: ['ADMIN'] }), true)
  assert.equal(hasContentAccess([UserRole.ADMIN]), true)
})

test('hasContentAccess rejects non-content roles', () => {
  assert.equal(hasContentAccess({ role_names: ['teammate'] }), false)
  assert.equal(hasContentAccess({ role_names: ['leader'] }), false)
  assert.equal(hasContentAccess({ role_names: ['Trainer', 'Mentor'] }), false)
  assert.equal(hasContentAccess({ role_names: ['HR'] }), false)
  assert.equal(hasContentAccess({ role_names: [] }), false)
  assert.equal(hasContentAccess(null), false)
  assert.equal(hasContentAccess(undefined), false)
})

test('getPartitionForPath correctly partitions routes', () => {
  // MEMBER_INFO (Portfolio)
  assert.equal(getPartitionForPath('/admin/portfolio'), 'MEMBER_INFO')
  assert.equal(getPartitionForPath('/admin/portfolio/edit'), 'MEMBER_INFO')

  // CONTENT_MANAGEMENT (Admin Content Zone)
  assert.equal(getPartitionForPath('/admin'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/blogs'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/blogs/create'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/projects'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/events'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/posts'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/generations'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/keywords'), 'CONTENT_MANAGEMENT')
  assert.equal(getPartitionForPath('/admin/introductions'), 'CONTENT_MANAGEMENT')

  // Public / Other routes
  assert.equal(getPartitionForPath('/'), 'OTHER')
  assert.equal(getPartitionForPath('/blog'), 'OTHER')
  assert.equal(getPartitionForPath('/events'), 'OTHER')
  assert.equal(getPartitionForPath('/members/huynhnguyen'), 'OTHER')
})
