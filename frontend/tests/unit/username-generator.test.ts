import test from 'node:test'
import assert from 'node:assert/strict'
import {
  removeVietnameseAccents,
  isValidUsernameFormat,
  slugifyUsername,
  generateInitialUsername,
} from '../../lib/portfolio/username-generator'

test('removeVietnameseAccents removes accents correctly', () => {
  assert.equal(removeVietnameseAccents('Huỳnh Phước Nguyên'), 'Huynh Phuoc Nguyen')
  assert.equal(removeVietnameseAccents('Đặng Đình Đoan'), 'Dang Dinh Doan')
  assert.equal(removeVietnameseAccents('Lê Văn Đức'), 'Le Van Duc')
})

test('isValidUsernameFormat validates username format strictly', () => {
  // Valid (length 3-30, lowercase alphanumeric, dashes, underscores)
  assert.equal(isValidUsernameFormat('nguyen-huynh'), true)
  assert.equal(isValidUsernameFormat('alex_123'), true)
  assert.equal(isValidUsernameFormat('dut-ai-dev'), true)

  // Invalid: too short (<3) or too long (>30)
  assert.equal(isValidUsernameFormat('ab'), false)
  assert.equal(isValidUsernameFormat('a'.repeat(31)), false)

  // Invalid: leading/trailing hyphens or symbols
  assert.equal(isValidUsernameFormat('-admin'), false)
  assert.equal(isValidUsernameFormat('admin-'), false)
  assert.equal(isValidUsernameFormat('user@name'), false)
  assert.equal(isValidUsernameFormat('User Name'), false)
})

test('slugifyUsername converts arbitrary strings to URL-safe slugs', () => {
  assert.equal(slugifyUsername('Huỳnh Phước Nguyên'), 'huynh-phuoc-nguyen')
  assert.equal(slugifyUsername('   Special @#$ Characters  '), 'special-characters')
  assert.equal(slugifyUsername(''), 'member')
})

test('generateInitialUsername generates safe unique initial usernames', () => {
  // From Full Name
  const u1 = generateInitialUsername('Nguyễn Văn An', 'an.nguyen@dut.udn.vn', 101)
  assert.ok(isValidUsernameFormat(u1), `Generated username '${u1}' must be valid format`)

  // Conflict with reserved words (e.g. "admin")
  const uAdmin = generateInitialUsername('Admin System', 'admin@dut.udn.vn', 1)
  assert.notEqual(uAdmin, 'admin', 'Must not clash with reserved username admin')
  assert.ok(isValidUsernameFormat(uAdmin), `Generated username '${uAdmin}' must be valid format`)
})
