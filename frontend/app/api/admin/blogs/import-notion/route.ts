import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { uploadToMinIO } from '@/lib/minio'
import { getBlogBySlugQuery } from '@/lib/db/features/blogs/queries'
import { parseNotionZip, rewriteMarkdownImageUrls } from '@/lib/notion/zip-parser'

export const dynamic = 'force-dynamic'

const MAX_ZIP_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Vui lòng chọn tệp ZIP xuất từ Notion.' },
        { status: 400 }
      )
    }

    // Check size limit
    if (file.size > MAX_ZIP_SIZE) {
      return NextResponse.json(
        { error: 'Dung lượng tệp ZIP vượt quá giới hạn cho phép (tối đa 50 MB).' },
        { status: 413 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Parse ZIP archive in-memory
    let parsed
    try {
      parsed = await parseNotionZip(buffer)
    } catch (parseError: any) {
      return NextResponse.json(
        {
          error:
            parseError?.message ||
            'File ZIP không chứa tệp nội dung Markdown (.md) hợp lệ từ Notion.',
        },
        { status: 422 }
      )
    }

    // 2. Batch upload extracted image assets to MinIO (blogs/ folder)
    const urlMapping = new Map<string, string>()
    const uploadWarnings: string[] = []

    const uploadPromises = parsed.images.map(async (img) => {
      try {
        const uploadResult = await uploadToMinIO(
          img.buffer,
          img.fileName,
          img.mimeType,
          'blogs'
        )
        urlMapping.set(img.zipPath, uploadResult.url)
        urlMapping.set(img.normalizedPath, uploadResult.url)
      } catch (uploadErr: any) {
        console.error(`Failed to upload ${img.fileName} to MinIO:`, uploadErr)
        uploadWarnings.push(`Không thể tải ảnh "${img.fileName}" lên MinIO.`)
      }
    })

    await Promise.all(uploadPromises)

    // 3. Rewrite Markdown image URLs to public MinIO URLs
    const rewrittenContent = rewriteMarkdownImageUrls(
      parsed.markdownContent,
      urlMapping
    )

    // 4. Check if the generated slug already exists
    let isSlugDuplicate = false
    try {
      const existing = await getBlogBySlugQuery(parsed.slug)
      if (existing) {
        isSlugDuplicate = true
      }
    } catch (dbErr) {
      console.error('Failed to check existing slug:', dbErr)
    }

    const warnings = [...uploadWarnings]
    if (isSlugDuplicate) {
      warnings.push(`Slug "${parsed.slug}" đã tồn tại. Vui lòng chỉnh sửa slug trước khi lưu.`)
    }

    return NextResponse.json({
      success: true,
      title: parsed.title,
      slug: parsed.slug,
      isSlugDuplicate,
      summary: parsed.summary,
      content: rewrittenContent,
      imagesCount: urlMapping.size > 0 ? parsed.images.length : 0,
      warnings,
    })
  } catch (error: any) {
    console.error('Notion ZIP import error:', error)
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Không thể xử lý tệp ZIP hoặc tải ảnh lên bộ lưu trữ MinIO.',
      },
      { status: 500 }
    )
  }
}
