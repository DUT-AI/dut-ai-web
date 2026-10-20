import { desc, eq, ilike, sql } from 'drizzle-orm'
import { db } from '../../index'
import { keywords } from './schema'
import { BlogKeywordResponse } from './types'

export async function getBlogKeywordsQuery(): Promise<BlogKeywordResponse[]> {
  const result = await db.select().from(keywords).orderBy(desc(keywords.numberBlogContain))
  return result.map((k) => ({
    id: k.id,
    keyword_name: k.keywordName,
    number_blog_contain: k.numberBlogContain ?? 0,
  }))
}

export async function createKeywordQuery(keywordName: string): Promise<number> {
  const cleanName = keywordName.trim()

  // 1. Check if keyword already exists (case-insensitive)
  const existing = await db
    .select({ id: keywords.id })
    .from(keywords)
    .where(ilike(keywords.keywordName, cleanName))
    .limit(1)

  if (existing.length > 0 && existing[0]?.id) {
    return existing[0].id
  }

  // 2. Insert with onConflict handling
  const [created] = await db
    .insert(keywords)
    .values({
      keywordName: cleanName,
      numberBlogContain: 0,
    })
    .onConflictDoNothing({ target: keywords.keywordName })
    .returning({ id: keywords.id })

  if (created?.id) {
    return created.id
  }

  // 3. Fallback: retrieve the existing keyword ID if onConflictDoNothing triggered
  const [fallback] = await db
    .select({ id: keywords.id })
    .from(keywords)
    .where(ilike(keywords.keywordName, cleanName))
    .limit(1)

  if (fallback?.id) {
    return fallback.id
  }

  throw new Error('Không thể tạo từ khóa mới.')
}

export async function updateKeywordQuery(id: number, keywordName: string): Promise<void> {
  await db
    .update(keywords)
    .set({
      keywordName,
    })
    .where(eq(keywords.id, id))
}

export async function deleteKeywordQuery(id: number): Promise<void> {
  await db.delete(keywords).where(eq(keywords.id, id))
}
