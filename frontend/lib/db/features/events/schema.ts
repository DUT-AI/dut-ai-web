import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const publicEvents = pgTable(
  'public_events',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    summary: text('summary'),
    imgUrl: varchar('img_url', { length: 1000 }),
    eventsDate: timestamp('events_date', { mode: 'date' }),
    location: varchar('location', { length: 255 }),
    registerLink: varchar('register_link', { length: 1000 }),
    facebookUrl: varchar('facebook_url', { length: 1000 }),
    tags: varchar('tags').array(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('ix_public_events_id').on(table.id),
  ]
)

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    summary: text('summary'),
    imgUrls: varchar('img_urls').array(),
    hashtag: varchar('hashtag', { length: 255 }),
    eventsDate: timestamp('events_date', { mode: 'date' }),
    facebookUrl: varchar('facebook_url', { length: 1000 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('ix_posts_id').on(table.id),
  ]
)

export type PublicEventModel = typeof publicEvents.$inferSelect
export type NewPublicEvent = typeof publicEvents.$inferInsert

export type PostModel = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
