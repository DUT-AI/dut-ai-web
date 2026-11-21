import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const generations = pgTable(
  'generations',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),
    period: varchar('period', { length: 100 }),
    description: text('description'),
    coverImageUrl: varchar('cover_image_url', { length: 1000 }),
    accentColor: varchar('accent_color', { length: 20 }).notNull().default('#2563eb'),
    displayOrder: integer('display_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('ix_generations_slug').on(table.slug),
    index('ix_generations_display_order').on(table.displayOrder),
  ]
)

export const generationDepartments = pgTable(
  'generation_departments',
  {
    id: serial('id').primaryKey(),
    generationId: integer('generation_id')
      .notNull()
      .references(() => generations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 150 }).notNull(),
    description: text('description'),
    accentColor: varchar('accent_color', { length: 20 }).notNull().default('#2563eb'),
    displayOrder: integer('display_order').notNull().default(0),
  },
  (table) => [index('ix_generation_departments_generation_id').on(table.generationId)]
)

export const generationMembers = pgTable(
  'generation_members',
  {
    generationId: integer('generation_id')
      .notNull()
      .references(() => generations.id, { onDelete: 'cascade' }),
    departmentId: integer('department_id')
      .notNull()
      .references(() => generationDepartments.id, { onDelete: 'cascade' }),
    externalUserId: integer('external_user_id').notNull(),
    title: varchar('title', { length: 150 }).notNull().default('Thành viên'),
    displayOrder: integer('display_order').notNull().default(0),
    isFeatured: boolean('is_featured').notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.departmentId, table.externalUserId] }),
    index('ix_generation_members_generation_id').on(table.generationId),
    index('ix_generation_members_external_user_id').on(table.externalUserId),
  ]
)

export const generationsRelations = relations(generations, ({ many }) => ({
  departments: many(generationDepartments),
  members: many(generationMembers),
}))

export const generationDepartmentsRelations = relations(generationDepartments, ({ one, many }) => ({
  generation: one(generations, {
    fields: [generationDepartments.generationId],
    references: [generations.id],
  }),
  members: many(generationMembers),
}))

export const generationMembersRelations = relations(generationMembers, ({ one }) => ({
  generation: one(generations, {
    fields: [generationMembers.generationId],
    references: [generations.id],
  }),
  department: one(generationDepartments, {
    fields: [generationMembers.departmentId],
    references: [generationDepartments.id],
  }),
}))

export type GenerationModel = typeof generations.$inferSelect
export type GenerationDepartmentModel = typeof generationDepartments.$inferSelect
export type GenerationMemberModel = typeof generationMembers.$inferSelect
