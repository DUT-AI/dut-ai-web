import test from 'node:test'
import assert from 'node:assert/strict'
import { getVietnameseInitial, getAvatarColor, AVATAR_COLOR_PALETTE } from '../../lib/vietnamese-names'

test('getVietnameseInitial extracts the initial of the Vietnamese first name (tên gọi)', () => {
  // Standard Vietnamese full names: Họ + Tên đệm + Tên gọi -> Initial of Tên gọi
  assert.equal(getVietnameseInitial('Huỳnh Phước Nguyên'), 'N') // Nguyên -> N
  assert.equal(getVietnameseInitial('Nguyễn Văn An'), 'A') // An -> A
  assert.equal(getVietnameseInitial('Phan Thanh Sơn'), 'S') // Sơn -> S
  assert.equal(getVietnameseInitial('Trần Thị Bích Ngọc'), 'N') // Ngọc -> N
  assert.equal(getVietnameseInitial('Lê Hoàng Long'), 'L') // Long -> L
  assert.equal(getVietnameseInitial('Đỗ Nam Trung'), 'T') // Trung -> T

  // Single word names or usernames
  assert.equal(getVietnameseInitial('Admin'), 'A')
  assert.equal(getVietnameseInitial('dutai'), 'D')

  // Extra whitespace handling
  assert.equal(getVietnameseInitial('   Nguyễn   Văn   Bình   '), 'B')

  // Null, undefined, empty handling
  assert.equal(getVietnameseInitial(''), 'D')
  assert.equal(getVietnameseInitial(null as any), 'D')
  assert.equal(getVietnameseInitial(undefined as any), 'D')
})

test('getAvatarColor returns a deterministic color from the palette', () => {
  const color1 = getAvatarColor('Nguyễn Văn An')
  const color2 = getAvatarColor('Nguyễn Văn An')
  assert.equal(color1, color2, 'Same author name must yield identical color')

  assert.ok(AVATAR_COLOR_PALETTE.includes(color1 as any), 'Color must be member of palette')

  // Empty string handling
  const defaultColor = getAvatarColor('')
  assert.ok(AVATAR_COLOR_PALETTE.includes(defaultColor as any))
})
