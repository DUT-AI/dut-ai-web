import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  primaryKey,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { tsvector } from '../../utils'
import { users } from '../users/schema'
import { keywords } from '../keywords/schema'

export const blogs = pgTable(
  'blogs',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 500 }),
    summary: text('summary'),
    views: integer('views').default(0),
    imageUrl: varchar('image_url', { length: 1000 }),
    searchVector: tsvector('search_vector'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    uniqueIndex('ix_blogs_slug').on(table.slug),
    index('ix_blogs_search_vector').using('gin', table.searchVector),
  ]
)

export const blogAuthors = pgTable(
  'blog_authors',
  {
    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.blogId, table.userId] }),
  ]
)

export const blogKeywords = pgTable(
  'blog_keywords',
  {
    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    keywordId: integer('keyword_id')
      .notNull()
      .references(() => keywords.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.blogId, table.keywordId] }),
  ]
)

export const blogsRelations = relations(blogs, ({ many }) => ({
  blogAuthors: many(blogAuthors),
  blogKeywords: many(blogKeywords),
}))

export const blogAuthorsRelations = relations(blogAuthors, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogAuthors.blogId],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [blogAuthors.userId],
    references: [users.id],
  }),
}))

export const blogKeywordsRelations = relations(blogKeywords, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogKeywords.blogId],
    references: [blogs.id],
  }),
  keyword: one(keywords, {
    fields: [blogKeywords.keywordId],
    references: [keywords.id],
  }),
}))

export type BlogModel = typeof blogs.$inferSelect
export type NewBlog = typeof blogs.$inferInsert

export type BlogAuthorRelationModel = typeof blogAuthors.$inferSelect
export type NewBlogAuthor = typeof blogAuthors.$inferInsert

export type BlogKeywordRelationModel = typeof blogKeywords.$inferSelect
export type NewBlogKeyword = typeof blogKeywords.$inferInsert
