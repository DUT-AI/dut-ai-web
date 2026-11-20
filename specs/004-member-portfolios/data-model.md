# Data Model: Member Portfolio Profiles

**Feature**: `004-member-portfolios`
**Date**: 2026-11-20

## 1. Entity Overview

```text
+-----------------------+              +------------------------------+
|      users (SSO)      |              |    user_portfolio_projects   |
| (manage.dutai.io.vn)  |              +------------------------------+
+-----------------------+              | id: serial (PK)              |
| id: integer (PK)      | <---+        | user_id: integer (FK)        |
| name: string          |     |        | title: varchar(255)          |
| email: string         |     |        | description: text            |
+-----------------------+     |        | image_url: varchar(1000)     |
           |                  |        | demo_url: varchar(1000)      |
           | 1:1              | 1:N    | repo_url: varchar(1000)      |
           v                  |        | technologies: text           |
+-----------------------+     |        | display_order: integer       |
|        user_cv        |     |        +------------------------------+
+-----------------------+     |
| id: serial (PK)       |     |        +------------------------------+
| user_id: integer (UQ) |-----+        |       project_members        |
| username: varchar(50) | (Indexed, UQ)+------------------------------+
| quote: text           |              | project_id: integer (FK)     |
| headline: varchar(255)|              | external_user_id: int (FK) --+ (Links club projects)
| bio: text             |              | role: varchar(100)           |
| avatar_url: text      |              +------------------------------+
| github_url: text      |                             |
| linkedin_url: text    |                             | N:1
| facebook_url: text    |                             v
| website_url: text     |              +------------------------------+
| skills: jsonb         |              |           projects           |
| cv_file_url: text     |              +------------------------------+
| cv_file_name: text    |              | id: serial (PK)              |
| cv_file_size: integer |              | title: varchar(255)          |
| is_public: boolean    |              | description: text            |
| created_at: timestamp |              | image_url: varchar(1000)     |
| updated_at: timestamp |              | demo_url: varchar(1000)      |
+-----------------------+              | technologies: text           |
                                       +------------------------------+
```

---

## 2. Table Specifications

### A. Extended Table: `user_cv`

| Column | Type | Nullable | Default | Description & Validation |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | No | Auto | Primary key |
| `user_id` | `integer` | No | - | Foreign ID referencing external SSO member ID (Unique index) |
| `username` | `varchar(50)` | No | Auto-gen | Unique vanity handle (`/members/[username]`). Validated against `^[a-z0-9_-]{3,30}$` |
| `quote` | `text` | Yes | null | Short motto/quote displayed on member album & hero |
| `headline` | `varchar(255)` | Yes | null | Professional title, e.g., "Fullstack AI Engineer" |
| `bio` | `text` | Yes | null | Extended markdown/plain text biography |
| `avatar_url` | `varchar(1000)`| Yes | null | Optional override for member profile avatar |
| `github_url` | `varchar(500)` | Yes | null | URL to GitHub profile |
| `linkedin_url`| `varchar(500)` | Yes | null | URL to LinkedIn profile |
| `facebook_url`| `varchar(500)` | Yes | null | URL to Facebook profile |
| `website_url` | `varchar(500)` | Yes | null | Personal website or blog URL |
| `skills` | `jsonb` | Yes | `'[]'` | Structured array of `{ category: string, items: string[] }` |
| `cv_file_url` | `varchar(1000)`| Yes | null | MinIO public URL to uploaded PDF resume |
| `cv_file_name`| `varchar(255)` | Yes | null | Original uploaded file name |
| `cv_file_size`| `integer` | Yes | null | File size in bytes (max 10,485,760 bytes = 10MB) |
| `is_public` | `boolean` | No | `true` | Public visibility toggle |
| `created_at` | `timestamp` | No | `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | No | `now()` | Record update timestamp |

**Indexes & Constraints**:
- `uniqueIndex('ix_user_cv_user_id').on(table.userId)`
- `uniqueIndex('ix_user_cv_username').on(table.username)`

---

### B. New Table: `user_portfolio_projects`

| Column | Type | Nullable | Default | Description & Validation |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `serial` | No | Auto | Primary key |
| `user_id` | `integer` | No | - | Foreign ID referencing member ID |
| `title` | `varchar(255)` | No | - | Name of the personal project |
| `description` | `text` | Yes | null | Description of project features and achievements |
| `image_url` | `varchar(1000)`| Yes | null | Preview/thumbnail image URL |
| `demo_url` | `varchar(1000)`| Yes | null | Live demo link |
| `repo_url` | `varchar(1000)`| Yes | null | Source code repository link |
| `technologies`| `text` | Yes | null | Comma-separated tech list (e.g. "Next.js, PyTorch") |
| `display_order`| `integer` | No | `0` | Order of presentation |
| `created_at` | `timestamp` | No | `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | No | `now()` | Record update timestamp |

**Indexes**:
- `index('ix_user_portfolio_projects_user_id').on(table.userId)`

---

## 3. Drizzle ORM Schema Definition

```typescript
// frontend/lib/db/features/users/schema.ts

import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar, index } from 'drizzle-orm/pg-core'

export interface SkillCategory {
  category: string
  items: string[]
}

export const userCvs = pgTable(
  'user_cv',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    username: varchar('username', { length: 50 }).notNull(),
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
  (table) => [
    index('ix_user_portfolio_projects_user_id').on(table.userId),
  ]
)

export type UserCvModel = typeof userCvs.$inferSelect
export type InsertUserCv = typeof userCvs.$inferInsert

export type UserPortfolioProjectModel = typeof userPortfolioProjects.$inferSelect
export type InsertUserPortfolioProject = typeof userPortfolioProjects.$inferInsert
```
