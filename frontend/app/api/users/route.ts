import { getManageUsers } from '@/lib/manage-users'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET() {
  try {
    const data = await getManageUsers()
    return jsonResponse(
      data.map(({ email: _email, phone_number: _phone, discord_id: _discord, ...user }) => user)
    )
  } catch (error) {
    console.error('Failed to get users:', error)
    return errorResponse('Failed to fetch users', 500)
  }
}
