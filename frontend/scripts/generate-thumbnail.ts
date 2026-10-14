import fs from 'node:fs'
import path from 'node:path'
import { createBlogThumbnail } from '../lib/blog-thumbnail'

/**
 * Script to generate a standalone OpenGraph blog thumbnail PNG image for quality inspection.
 *
 * Usage:
 *   npx tsx scripts/generate-thumbnail.ts
 *   npx tsx scripts/generate-thumbnail.ts --title="Tiêu đề tuỳ chọn" --author="Huỳnh Phước Nguyên" --author="Nguyễn Văn An"
 */
async function main() {
  const args = process.argv.slice(2)
  let title = 'Xây dựng hệ thống AI hiện đại: Từ ý tưởng đến sản phẩm thực tế'
  let outPath = path.resolve(process.cwd(), 'preview-thumbnail.png')
  const customAuthors: Array<{ name: string; avatarUrl?: string | null }> = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--title=')) {
      title = arg.replace('--title=', '')
    } else if (arg === '--title' && args[i + 1]) {
      title = args[++i]
    } else if (arg.startsWith('--author=')) {
      customAuthors.push({ name: arg.replace('--author=', '') })
    } else if (arg === '--author' && args[i + 1]) {
      customAuthors.push({ name: args[++i] })
    } else if (arg.startsWith('--out=')) {
      outPath = path.resolve(process.cwd(), arg.replace('--out=', ''))
    } else if (arg === '--out' && args[i + 1]) {
      outPath = path.resolve(process.cwd(), args[++i])
    }
  }

  const authors =
    customAuthors.length > 0
      ? customAuthors
      : [
          { name: 'Huỳnh Phước Nguyên', avatarUrl: null },
          { name: 'Nguyễn Văn An', avatarUrl: null },
        ]

  console.log('🎨 Generating thumbnail image...')
  console.log(`📌 Title: "${title}"`)
  console.log(`👥 Authors: ${authors.map((a) => a.name).join(', ')}`)

  const response = createBlogThumbnail({
    title,
    authors,
  })

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  fs.writeFileSync(outPath, buffer)

  console.log(`\n✅ Generated successfully!`)
  console.log(`📁 File saved at: ${outPath}`)
  console.log(`📊 File size: ${(buffer.byteLength / 1024).toFixed(1)} KB`)
  console.log(`\n👉 Mở ảnh trên macOS bằng lệnh:`)
  console.log(`   open "${outPath}"\n`)
}

main().catch((err) => {
  console.error('❌ Failed to generate thumbnail:', err)
  process.exit(1)
})
