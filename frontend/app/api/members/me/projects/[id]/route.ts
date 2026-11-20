import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminSession } from '@/lib/admin-auth'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'
import {
  updatePersonalProjectQuery,
  deletePersonalProjectQuery,
} from '@/lib/db/features/users/queries'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

const updateProjectSchema = z.object({
  title: z.string().min(1, 'Tiêu đề dự án không được để trống').max(255).optional(),
  description: z.string().optional().nullable(),
  image_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  demo_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  repo_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  technologies: z.string().optional().nullable(),
  display_order: z.number().int().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const projectId = Number(id)
    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400)
    }

    const userId = Number(session.user.id)
    const body = await request.json()
    const parsed = updateProjectSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ', 400)
    }

    const data = parsed.data
    const updated = await updatePersonalProjectQuery(projectId, userId, {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.image_url !== undefined ? { imageUrl: data.image_url || null } : {}),
      ...(data.demo_url !== undefined ? { demoUrl: data.demo_url || null } : {}),
      ...(data.repo_url !== undefined ? { repoUrl: data.repo_url || null } : {}),
      ...(data.technologies !== undefined ? { technologies: data.technologies } : {}),
      ...(data.display_order !== undefined ? { displayOrder: data.display_order } : {}),
    })

    if (!updated) {
      return errorResponse('Không tìm thấy dự án hoặc không có quyền cập nhật', 404)
    }

    return jsonResponse(updated)
  } catch (error) {
    console.error('Error in PUT /api/members/me/projects/[id]:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const projectId = Number(id)
    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400)
    }

    const userId = Number(session.user.id)
    const deleted = await deletePersonalProjectQuery(projectId, userId)

    if (!deleted) {
      return errorResponse('Không tìm thấy dự án để xóa', 404)
    }

    return jsonResponse({ success: true, message: 'Đã xóa dự án thành công' })
  } catch (error) {
    console.error('Error in DELETE /api/members/me/projects/[id]:', error)
    return errorResponse('Internal server error', 500)
  }
}
