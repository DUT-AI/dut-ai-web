import { asc, eq } from 'drizzle-orm'
import { db } from '../../index'
import { users } from './schema'
import { MemberResponse } from './types'

export async function getMembersQuery(): Promise<MemberResponse[]> {
  const userList = await db.select().from(users).orderBy(asc(users.id))
  return userList.map((u) => ({
    id: u.id,
    name: u.name ?? 'Member',
    email: u.email ?? undefined,
    phone_number: u.phoneNumber ?? undefined,
    status: u.status ?? undefined,
    role_id: u.roleId ?? undefined,
    role_name: u.roleName ?? 'Member',
    avatar_url: u.avatarUrl ?? undefined,
    discord_id: u.discordId ?? undefined,
  }))
}

export async function getUserByIdQuery(id: number): Promise<MemberResponse | null> {
  const [u] = await db.select().from(users).where(eq(users.id, id))
  if (!u) return null
  return {
    id: u.id,
    name: u.name ?? 'Member',
    email: u.email ?? undefined,
    phone_number: u.phoneNumber ?? undefined,
    status: u.status ?? undefined,
    role_id: u.roleId ?? undefined,
    role_name: u.roleName ?? 'Member',
    avatar_url: u.avatarUrl ?? undefined,
    discord_id: u.discordId ?? undefined,
  }
}
