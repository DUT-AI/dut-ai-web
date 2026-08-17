import { desc, eq } from 'drizzle-orm'
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
  const [created] = await db
    .insert(keywords)
    .values({
      keywordName,
      numberBlogContain: 0,
    })
    .returning({ id: keywords.id })
  return created.id
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
