import { desc, eq } from 'drizzle-orm'
import { db } from '../../index'
import { formatDate } from '../../utils'
import { publicEvents, posts } from './schema'
import { PublicEventResponse, PostResponse } from './types'

export async function getPublicEventsQuery(): Promise<PublicEventResponse[]> {
  const list = await db
    .select()
    .from(publicEvents)
    .orderBy(desc(publicEvents.eventsDate), desc(publicEvents.id))

  return list.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description ?? undefined,
    summary: e.summary ?? undefined,
    img_url: e.imgUrl ?? undefined,
    events_date: formatDate(e.eventsDate),
    location: e.location ?? undefined,
    register_link: e.registerLink ?? undefined,
    facebook_url: e.facebookUrl ?? undefined,
    tags: e.tags ?? undefined,
    created_at: formatDate(e.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(e.updatedAt) ?? new Date().toISOString(),
  }))
}

export async function getPublicEventByIdQuery(id: number): Promise<PublicEventResponse | null> {
  const [e] = await db.select().from(publicEvents).where(eq(publicEvents.id, id))
  if (!e) return null
  return {
    id: e.id,
    title: e.title,
    description: e.description ?? undefined,
    summary: e.summary ?? undefined,
    img_url: e.imgUrl ?? undefined,
    events_date: formatDate(e.eventsDate),
    location: e.location ?? undefined,
    register_link: e.registerLink ?? undefined,
    facebook_url: e.facebookUrl ?? undefined,
    tags: e.tags ?? undefined,
    created_at: formatDate(e.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(e.updatedAt) ?? new Date().toISOString(),
  }
}

export async function getPostsQuery(): Promise<PostResponse[]> {
  const list = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.eventsDate), desc(posts.id))

  return list.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? undefined,
    summary: p.summary ?? undefined,
    img_urls: p.imgUrls ?? undefined,
    hashtag: p.hashtag ?? undefined,
    events_date: formatDate(p.eventsDate),
    facebook_url: p.facebookUrl ?? undefined,
    created_at: formatDate(p.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(p.updatedAt) ?? new Date().toISOString(),
  }))
}

export async function getPostByIdQuery(id: number): Promise<PostResponse | null> {
  const [p] = await db.select().from(posts).where(eq(posts.id, id))
  if (!p) return null
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? undefined,
    summary: p.summary ?? undefined,
    img_urls: p.imgUrls ?? undefined,
    hashtag: p.hashtag ?? undefined,
    events_date: formatDate(p.eventsDate),
    facebook_url: p.facebookUrl ?? undefined,
    created_at: formatDate(p.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(p.updatedAt) ?? new Date().toISOString(),
  }
}
