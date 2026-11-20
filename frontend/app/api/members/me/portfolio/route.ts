import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminSession } from '@/lib/admin-auth'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'
import {
  getUserCvByUserIdQuery,
  upsertMemberPortfolioQuery,
  getUserPortfolioProjectsQuery,
  getMemberClubProjectsQuery,
} from '@/lib/db/features/users/queries'
import { isReservedUsername } from '@/lib/portfolio/reserved-usernames'
import { isValidUsernameFormat } from '@/lib/portfolio/username-generator'
import { db } from '@/lib/db'
import { userCvs } from '@/lib/db/features/users/schema'
import { eq, and, ne } from 'drizzle-orm'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

const updatePortfolioSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => isValidUsernameFormat(val), {
      message: 'Username phải từ 3-30 ký tự, chỉ gồm chữ thường, số, dấu gạch dưới hoặc gạch ngang',
    })
    .refine((val) => !isReservedUsername(val), {
      message: 'Username này thuộc từ khóa hệ thống, vui lòng chọn tên khác',
    }),
  headline: z.string().max(255).optional().nullable(),
  quote: z.string().max(1000).optional().nullable(),
  bio: z.string().optional().nullable(),
  avatar_url: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  github_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  linkedin_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  facebook_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  website_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  skills: z
    .array(
      z.object({
        category: z.string(),
        items: z.array(z.string()),
      })
    )
    .optional(),
  is_public: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = Number(session.user.id)
    const [cv, personalProjects, clubProjects] = await Promise.all([
      getUserCvByUserIdQuery(userId),
      getUserPortfolioProjectsQuery(userId),
      getMemberClubProjectsQuery(userId),
    ])

    return jsonResponse({
      user: session.user,
      cv,
      projects: {
        personal: personalProjects,
        club: clubProjects,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/members/me/portfolio:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated || !session.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = Number(session.user.id)
    const body = await request.json()
    const parsed = updatePortfolioSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ', 400)
    }

    const { username, ...rest } = parsed.data

    // Check username uniqueness (not taken by another user)
    const existing = await db.query.userCvs.findFirst({
      where: and(eq(userCvs.username, username), ne(userCvs.userId, userId)),
    })

    if (existing) {
      return errorResponse('Username này đã được sử dụng bởi thành viên khác', 409)
    }

    await upsertMemberPortfolioQuery(userId, {
      username,
      ...rest,
      avatar_url: rest.avatar_url || null,
      github_url: rest.github_url || null,
      linkedin_url: rest.linkedin_url || null,
      facebook_url: rest.facebook_url || null,
      website_url: rest.website_url || null,
    })

    return jsonResponse({
      success: true,
      message: 'Cập nhật hồ sơ cá nhân thành công',
    })
  } catch (error) {
    console.error('Error in PUT /api/members/me/portfolio:', error)
    return errorResponse('Internal server error', 500)
  }
}
