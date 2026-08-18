import { NextRequest } from 'next/server'
import { getProjectsQuery } from '@/lib/db/queries'
import { db, projects, projectMembers, NewProject } from '@/lib/db'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET() {
  try {
    const data = await getProjectsQuery()
    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get projects:', error)
    return errorResponse('Failed to fetch projects', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url, features, technologies, demo_url, video_url, members } = body

    if (!title) {
      return errorResponse('Title is required', 400)
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        title,
        description: description ?? null,
        imageUrl: image_url ?? null,
        features: features ?? null,
        technologies: technologies ?? null,
        demoUrl: demo_url ?? null,
        videoUrl: video_url ?? null,
      })
      .returning()

    if (Array.isArray(members) && members.length > 0) {
      await db.insert(projectMembers).values(
        members.map((m: { user_id: number; role: string }) => ({
          projectId: newProject.id,
          userId: m.user_id,
          role: m.role || 'Member',
        }))
      )
    }

    return jsonResponse(newProject, 201)
  } catch (error) {
    console.error('Failed to create project:', error)
    return errorResponse('Failed to create project', 500)
  }
}
