import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const introductions = pgTable('introductions', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
})

export type IntroductionModel = typeof introductions.$inferSelect
export type NewIntroduction = typeof introductions.$inferInsert
