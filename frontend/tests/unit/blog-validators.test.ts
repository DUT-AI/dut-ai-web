import test from 'node:test'
import assert from 'node:assert/strict'
import { blogFormSchema } from '../../app/admin/blogs/schema'

test('blogFormSchema validates valid blog inputs successfully', () => {
  const validPayload = {
    title: 'Học sâu và Xử lý ngôn ngữ tự nhiên',
    slug: 'hoc-sau-va-nlp',
    summary: 'Tóm tắt bài viết về học sâu',
    content: '# Nội dung chi tiết về NLP',
    imageUrl: 'https://example.com/cover.png',
    image: null,
    authorIds: [1, 2],
    keywordIds: [10],
  }

  const result = blogFormSchema.safeParse(validPayload)
  assert.equal(result.success, true)
})

test('blogFormSchema rejects empty title', () => {
  const invalidPayload = {
    title: '   ',
    slug: 'bai-viet-moi',
    summary: '',
    content: 'Nội dung',
    imageUrl: '',
    authorIds: [],
    keywordIds: [],
  }

  const result = blogFormSchema.safeParse(invalidPayload)
  assert.equal(result.success, false)
  if (!result.success) {
    const issues = result.error.issues ?? (result.error as any).errors
    const titleError = issues.find((e: any) => e.path.includes('title'))
    assert.ok(titleError)
  }
})

test('blogFormSchema rejects invalid slug formats', () => {
  const testCases = [
    'Slug Co Hoa',
    'slug_co_gach_duoi',
    '-slug-dau-gach-',
    'slug có dấu tiếng việt',
    'slug!@#$',
  ]

  for (const invalidSlug of testCases) {
    const payload = {
      title: 'Bài viết hợp lệ',
      slug: invalidSlug,
      summary: '',
      content: 'Nội dung',
      imageUrl: '',
      authorIds: [],
      keywordIds: [],
    }

    const result = blogFormSchema.safeParse(payload)
    assert.equal(result.success, false, `Expected slug "${invalidSlug}" to fail validation`)
  }
})
