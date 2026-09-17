import { getManageUsers } from '@/lib/manage-users'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET() {
  try {
    const data = await getManageUsers()
    return jsonResponse(
      data.map(({ id, name, status, role_id, role_name, role_ids, role_names, avatar_url }) => ({
        id,
        name,
        status,
        role_id,
        role_name,
        role_ids,
        role_names,
        avatar_url,
      }))
    )
  } catch (error) {
    console.error('Failed to get members:', error)
    return errorResponse('Failed to fetch members', 500)
  }
}
