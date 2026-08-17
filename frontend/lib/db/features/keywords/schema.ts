import {
  pgTable,
  serial,
  varchar,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { blogKeywords } from '../blogs/schema'

export const keywords = pgTable(
  'keywords',
  {
    id: serial('id').primaryKey(),
    keywordName: varchar('keyword_name', { length: 255 }).notNull(),
    numberBlogContain: integer('number_blog_contain').default(0),
  },
  (table) => [
    index('ix_keywords_id').on(table.id),
    uniqueIndex('ix_keywords_keyword_name').on(table.keywordName),
  ]
)

export const keywordsRelations = relations(keywords, ({ many }) => ({
  blogKeywords: many(blogKeywords),
}))

export type KeywordModel = typeof keywords.$inferSelect
export type NewKeyword = typeof keywords.$inferInsert
