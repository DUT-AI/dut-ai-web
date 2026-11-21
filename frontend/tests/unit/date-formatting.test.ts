import test from 'node:test'
import assert from 'node:assert/strict'
import { formatDate } from '../../lib/db/utils'

test('formatDate returns undefined for null or undefined', () => {
  assert.equal(formatDate(null), undefined)
  assert.equal(formatDate(undefined), undefined)
})

test('formatDate converts Date instances to ISO 8601 strings', () => {
  const fixedDate = new Date('2026-11-21T00:00:00.000Z')
  assert.equal(formatDate(fixedDate), '2026-11-21T00:00:00.000Z')
})

test('formatDate converts string dates properly', () => {
  const dateStr = '2026-10-15T08:30:00Z'
  assert.equal(formatDate(dateStr as any), '2026-10-15T08:30:00Z')
})
