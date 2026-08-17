import {
  pgTable,
  serial,
  varchar,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { projectMembers } from '../projects/schema'
import { blogAuthors } from '../blogs/schema'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phoneNumber: varchar('phone_number', { length: 50 }),
    status: varchar('status', { length: 50 }),
    roleId: integer('role_id'),
    roleName: varchar('role_name', { length: 100 }),
    avatarUrl: varchar('avatar_url', { length: 1000 }),
    discordId: varchar('discord_id', { length: 100 }),
  },
  (table) => [
    index('ix_users_id').on(table.id),
    index('ix_users_name').on(table.name),
    uniqueIndex('ix_users_email').on(table.email),
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers),
  blogAuthors: many(blogAuthors),
}))

export type UserModel = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
