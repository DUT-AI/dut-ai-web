import { integer, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const userCvs = pgTable(
  'user_cv',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    quote: text('quote'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('ix_user_cv_user_id').on(table.userId),
  ]
)

export type UserCvModel = typeof userCvs.$inferSelect
export type InsertUserCv = typeof userCvs.$inferInsert
