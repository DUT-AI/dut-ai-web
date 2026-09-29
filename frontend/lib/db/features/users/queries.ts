import { eq } from 'drizzle-orm'
import { db } from '../../index'
import { userCvs } from './schema'
import type { UserCv } from './types'

export async function getUserCvsMapQuery(): Promise<Map<number, string>> {
  try {
    const rows = await db.select().from(userCvs)
    const map = new Map<number, string>()
    for (const row of rows) {
      if (row.quote) {
        map.set(row.userId, row.quote)
      }
    }
    return map
  } catch (error) {
    console.error('Failed to load user CVs:', error)
    return new Map()
  }
}

export async function getUserCvByUserIdQuery(userId: number): Promise<UserCv | null> {
  try {
    const row = await db.query.userCvs.findFirst({
      where: eq(userCvs.userId, userId),
    })
    if (!row) return null
    return {
      id: row.id,
      user_id: row.userId,
      quote: row.quote ?? undefined,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    }
  } catch (error) {
    console.error(`Failed to load CV for user ${userId}:`, error)
    return null
  }
}

export async function upsertUserCvQuery(userId: number, quote: string): Promise<void> {
  const now = new Date()
  await db
    .insert(userCvs)
    .values({
      userId,
      quote,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userCvs.userId,
      set: {
        quote,
        updatedAt: now,
      },
    })
}
