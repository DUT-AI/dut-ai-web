import { NextRequest } from 'next/server'
import { getProjectByIdQuery } from '@/lib/db/queries'
import { db, projects } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id, 10)
    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400)
    }

    const data = await getProjectByIdQuery(projectId)
    if (!data) {
      return errorResponse('Project not found', 404)
    }

    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get project:', error)
    return errorResponse('Failed to fetch project', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id, 10)
    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400)
    }

    await db.delete(projects).where(eq(projects.id, projectId))
    return jsonResponse({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Failed to delete project:', error)
    return errorResponse('Failed to delete project', 500)
  }
}
