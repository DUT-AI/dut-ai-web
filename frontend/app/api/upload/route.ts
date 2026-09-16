import { NextRequest, NextResponse } from 'next/server'
import { uploadToMinIO } from '@/lib/minio'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const MAX_MANAGED_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_MANAGED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
])

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const requestedFolder = formData.get('folder')
    const folder =
      requestedFolder === 'events' ||
      requestedFolder === 'moments' ||
      requestedFolder === 'projects'
        ? requestedFolder
        : 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (folder !== 'uploads') {
      if (!ALLOWED_MANAGED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: 'Chỉ hỗ trợ ảnh JPEG, PNG, GIF, WebP hoặc AVIF.' },
          { status: 415 }
        )
      }
      if (file.size === 0 || file.size > MAX_MANAGED_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Ảnh phải có dung lượng lớn hơn 0 và không quá 5 MB.' },
          { status: 413 }
        )
      }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadToMinIO(
      buffer,
      file.name,
      file.type || 'application/octet-stream',
      folder
    )

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: file.name,
    })
  } catch (error: any) {
    console.error('Upload to MinIO failed:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file to MinIO' },
      { status: 500 }
    )
  }
}
