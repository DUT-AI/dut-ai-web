import { NextRequest, NextResponse } from 'next/server'
import { uploadToMinIO } from '@/lib/minio'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadToMinIO(buffer, file.name, file.type || 'application/octet-stream')

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
