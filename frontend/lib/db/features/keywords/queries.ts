import { desc } from 'drizzle-orm'
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
