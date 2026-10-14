import test from 'node:test'
import assert from 'node:assert/strict'
import { getClubLogoDataUri } from '../../lib/blog-thumbnail-assets'
import { createBlogThumbnail } from '../../lib/blog-thumbnail'

test('getClubLogoDataUri loads logo.png as base64 data URI', () => {
  const logoUri = getClubLogoDataUri()
  assert.ok(logoUri.startsWith('data:image/png;base64,'), 'Logo URI must start with data:image/png;base64,')
  assert.ok(logoUri.length > 500, 'Logo data URI must contain substantial base64 data')
})

test('createBlogThumbnail generates ImageResponse with multi-author avatars and immutable headers', async () => {
  const response = createBlogThumbnail({
    title: 'Xây dựng hệ thống AI hiện đại với tiếng Việt chuẩn mực',
    authors: [
      { name: 'Huỳnh Phước Nguyên', avatarUrl: null },
      { name: 'Nguyễn Văn An', avatarUrl: null },
      { name: 'Phan Thanh Sơn', avatarUrl: null },
    ],
  })

  assert.ok(response instanceof Response, 'createBlogThumbnail must return a Response object')
  assert.equal(response.headers.get('content-type'), 'image/png')
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable')

  const arrayBuffer = await response.arrayBuffer()
  assert.ok(arrayBuffer.byteLength > 1000, 'ImageResponse must contain binary image data')
})

test('createBlogThumbnail handles legacy string array authors', async () => {
  const response = createBlogThumbnail({
    title: 'DUT AI Blog Post Title',
    authors: ['Nguyễn Văn An', 'Phan Thanh Sơn'],
  })

  assert.ok(response instanceof Response)
  const arrayBuffer = await response.arrayBuffer()
  assert.ok(arrayBuffer.byteLength > 1000)
})
