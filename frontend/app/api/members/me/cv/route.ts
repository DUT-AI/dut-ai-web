import { NextRequest } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'
import { uploadToMinIO } from '@/lib/minio'
import { upsertMemberPortfolioQuery, getUserCvByUserIdQuery } from '@/lib/db/features/users/queries'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = Number(session.user.id)
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return errorResponse('Vui lòng chọn tệp CV', 400)
    }

    if (file.type !== 'application/pdf') {
      return errorResponse('Chỉ chấp nhận tệp định dạng PDF', 400)
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('Dung lượng tệp CV không được vượt quá 10MB', 400)
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to MinIO under 'resumes' folder
    const { url } = await uploadToMinIO(buffer, file.name, 'application/pdf', 'resumes')

    await upsertMemberPortfolioQuery(userId, {
      cv_file_url: url,
      cv_file_name: file.name,
      cv_file_size: file.size,
    })

    return jsonResponse({
      success: true,
      data: {
        file_url: url,
        file_name: file.name,
        file_size: file.size,
      },
    })
  } catch (error) {
    console.error('Error uploading CV in POST /api/members/me/cv:', error)
    return errorResponse('Không thể tải lên tệp CV. Vui lòng thử lại sau', 500)
  }
}

export async function DELETE() {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = Number(session.user.id)
    const currentCv = await getUserCvByUserIdQuery(userId)

    if (currentCv) {
      await upsertMemberPortfolioQuery(userId, {
        cv_file_url: null,
        cv_file_name: null,
        cv_file_size: null,
      })
    }

    return jsonResponse({
      success: true,
      message: 'Đã xóa CV thành công',
    })
  } catch (error) {
    console.error('Error deleting CV in DELETE /api/members/me/cv:', error)
    return errorResponse('Không thể xóa CV', 500)
  }
}
