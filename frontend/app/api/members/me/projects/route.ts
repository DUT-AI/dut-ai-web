import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminSession } from '@/lib/admin-auth'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'
import {
  getUserPortfolioProjectsQuery,
  createPersonalProjectQuery,
} from '@/features/users/db/queries'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

const createProjectSchema = z.object({
  title: z.string().min(1, 'Tiêu đề dự án không được để trống').max(255),
  description: z.string().optional().nullable(),
  image_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  demo_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  repo_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  technologies: z.string().optional().nullable(),
  display_order: z.number().int().optional().default(0),
})

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = Number(session.user.id)
    const projects = await getUserPortfolioProjectsQuery(userId)
    return jsonResponse(projects)
  } catch (error) {
    console.error('Error in GET /api/members/me/projects:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = Number(session.user.id)
    const body = await request.json()
    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ', 400)
    }

    const data = parsed.data
    const created = await createPersonalProjectQuery({
      userId,
      title: data.title,
      description: data.description || null,
      imageUrl: data.image_url || null,
      demoUrl: data.demo_url || null,
      repoUrl: data.repo_url || null,
      technologies: data.technologies || null,
      displayOrder: data.display_order,
    })

    return jsonResponse(created, 201)
  } catch (error) {
    console.error('Error in POST /api/members/me/projects:', error)
    return errorResponse('Internal server error', 500)
  }
}
