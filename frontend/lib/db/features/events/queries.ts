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

export async function createPublicEventQuery(data: {
  title: string
  description?: string
  summary?: string
  imgUrl?: string
  eventsDate?: Date
  location?: string
  registerLink?: string
  facebookUrl?: string
  tags?: string[]
}): Promise<number> {
  const [created] = await db
    .insert(publicEvents)
    .values({
      title: data.title,
      description: data.description,
      summary: data.summary,
      imgUrl: data.imgUrl,
      eventsDate: data.eventsDate,
      location: data.location,
      registerLink: data.registerLink,
      facebookUrl: data.facebookUrl,
      tags: data.tags,
    })
    .returning({ id: publicEvents.id })

  return created.id
}

export async function updatePublicEventQuery(
  id: number,
  data: {
    title?: string
    description?: string
    summary?: string
    imgUrl?: string
    eventsDate?: Date
    location?: string
    registerLink?: string
    facebookUrl?: string
    tags?: string[]
  }
): Promise<void> {
  await db
    .update(publicEvents)
    .set({
      title: data.title,
      description: data.description,
      summary: data.summary,
      imgUrl: data.imgUrl,
      eventsDate: data.eventsDate,
      location: data.location,
      registerLink: data.registerLink,
      facebookUrl: data.facebookUrl,
      tags: data.tags,
      updatedAt: new Date(),
    })
    .where(eq(publicEvents.id, id))
}

export async function deletePublicEventQuery(id: number): Promise<void> {
  await db.delete(publicEvents).where(eq(publicEvents.id, id))
}

// ── Posts (Moments) ────────────────────────────────────────────────────────

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

export async function createPostQuery(data: {
  title: string
  description?: string
  summary?: string
  imgUrls?: string[]
  hashtag?: string
  eventsDate?: Date
  facebookUrl?: string
}): Promise<number> {
  const [created] = await db
    .insert(posts)
    .values({
      title: data.title,
      description: data.description,
      summary: data.summary,
      imgUrls: data.imgUrls,
      hashtag: data.hashtag,
      eventsDate: data.eventsDate,
      facebookUrl: data.facebookUrl,
    })
    .returning({ id: posts.id })

  return created.id
}

export async function updatePostQuery(
  id: number,
  data: {
    title?: string
    description?: string
    summary?: string
    imgUrls?: string[]
    hashtag?: string
    eventsDate?: Date
    facebookUrl?: string
  }
): Promise<void> {
  await db
    .update(posts)
    .set({
      title: data.title,
      description: data.description,
      summary: data.summary,
      imgUrls: data.imgUrls,
      hashtag: data.hashtag,
      eventsDate: data.eventsDate,
      facebookUrl: data.facebookUrl,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
}

export async function deletePostQuery(id: number): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id))
}
