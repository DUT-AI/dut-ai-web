import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from '../users/schema'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 1000 }),
  features: text('features'),
  technologies: text('technologies'),
  demoUrl: varchar('demo_url', { length: 1000 }),
  videoUrl: varchar('video_url', { length: 1000 }),
})

export const projectMembers = pgTable(
  'project_members',
  {
    id: serial('id').primaryKey(),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 100 }).notNull(),
  },
  (table) => [
    index('ix_project_members_project_id').on(table.projectId),
    index('ix_project_members_user_id').on(table.userId),
  ]
)

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
}))

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}))

export type ProjectModel = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type ProjectMemberModel = typeof projectMembers.$inferSelect
export type NewProjectMember = typeof projectMembers.$inferInsert
