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

export async function createUserQuery(data: {
  name: string
  email?: string
  phoneNumber?: string
  status?: string
  roleId?: number
  roleName?: string
  avatarUrl?: string
  discordId?: string
}): Promise<number> {
  const [created] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      status: data.status || 'active',
      roleId: data.roleId,
      roleName: data.roleName || 'Member',
      avatarUrl: data.avatarUrl,
      discordId: data.discordId,
    })
    .returning({ id: users.id })

  return created.id
}

export async function updateUserQuery(
  id: number,
  data: {
    name?: string
    email?: string
    phoneNumber?: string
    status?: string
    roleId?: number
    roleName?: string
    avatarUrl?: string
    discordId?: string
  }
): Promise<void> {
  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      status: data.status,
      roleId: data.roleId,
      roleName: data.roleName,
      avatarUrl: data.avatarUrl,
      discordId: data.discordId,
    })
    .where(eq(users.id, id))
}

export async function deleteUserQuery(id: number): Promise<void> {
  await db.delete(users).where(eq(users.id, id))
}
