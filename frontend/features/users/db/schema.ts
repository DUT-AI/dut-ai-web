import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export interface SkillCategory {
  category: string
  items: string[]
}

export const userCvs = pgTable(
  'user_cv',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    username: varchar('username', { length: 50 }),
    quote: text('quote'),
    headline: varchar('headline', { length: 255 }),
    bio: text('bio'),
    avatarUrl: varchar('avatar_url', { length: 1000 }),
    githubUrl: varchar('github_url', { length: 500 }),
    linkedinUrl: varchar('linkedin_url', { length: 500 }),
    facebookUrl: varchar('facebook_url', { length: 500 }),
    websiteUrl: varchar('website_url', { length: 500 }),
    skills: jsonb('skills').$type<SkillCategory[]>().default([]),
    cvFileUrl: varchar('cv_file_url', { length: 1000 }),
    cvFileName: varchar('cv_file_name', { length: 255 }),
    cvFileSize: integer('cv_file_size'),
    isPublic: boolean('is_public').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('ix_user_cv_user_id').on(table.userId),
    uniqueIndex('ix_user_cv_username').on(table.username),
  ]
)

export const userPortfolioProjects = pgTable(
  'user_portfolio_projects',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    imageUrl: varchar('image_url', { length: 1000 }),
    demoUrl: varchar('demo_url', { length: 1000 }),
    repoUrl: varchar('repo_url', { length: 1000 }),
    technologies: text('technologies'),
    displayOrder: integer('display_order').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('ix_user_portfolio_projects_user_id').on(table.userId)]
)

export type UserCvModel = typeof userCvs.$inferSelect
export type InsertUserCv = typeof userCvs.$inferInsert

export type UserPortfolioProjectModel = typeof userPortfolioProjects.$inferSelect
export type InsertUserPortfolioProject = typeof userPortfolioProjects.$inferInsert
