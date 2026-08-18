/**
 * Client-safe Typed API Client for DUT AI Web.
 * Re-exports domain types using "export type" so TypeScript erases them completely at build time.
 * Safe to import in both Client Components ('use client') and Server Components.
 */

// ── Re-export Domain Types (100% Single Source of Truth from Features) ────

export type { Member } from '@/lib/db/features/users/types'
export type {
  Project,
  ProjectMember,
  ProjectMemberDetail,
  CreateProjectInput,
} from '@/lib/db/features/projects/types'
export type { BlogKeyword } from '@/lib/db/features/keywords/types'
export type {
  Blog,
  BlogAuthor,
  AuthorStats,
} from '@/lib/db/features/blogs/types'
export type {
  PublicEvent,
  Post,
  PastEvent,
} from '@/lib/db/features/events/types'
export type { Introduction } from '@/lib/db/features/introductions/types'
export type { HomePageData } from '@/lib/db/features/homepage/types'

import type { Member } from '@/lib/db/features/users/types'
import type { Project } from '@/lib/db/features/projects/types'
import type { BlogKeyword } from '@/lib/db/features/keywords/types'
import type { Blog, AuthorStats } from '@/lib/db/features/blogs/types'
import type { PublicEvent, Post } from '@/lib/db/features/events/types'
import type { Introduction } from '@/lib/db/features/introductions/types'
import type { HomePageData } from '@/lib/db/features/homepage/types'

// ── Client Fetch Helper ────────────────────────────────────────────────────

const BASE =
  typeof window !== 'undefined'
    ? ''
    : (process.env.INTERNAL_API_URL || 'http://localhost:3000')

async function apiFetch<T>(path: string, options?: RequestInit & { revalidate?: number }): Promise<T> {
  const { revalidate = 300, ...fetchOptions } = options ?? {}
  const res = await fetch(`${BASE}/api${path}`, {
    ...fetchOptions,
    next: { revalidate },
  })
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ── Projects ──────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>('/projects', { revalidate: 600 })
}

export async function getProject(id: number): Promise<Project | null> {
  try {
    return await apiFetch<Project>(`/projects/${id}`, { revalidate: 600 })
  } catch {
    return null
  }
}

// ── Introductions ─────────────────────────────────────────────────────────

export async function getIntroductions(): Promise<Introduction[]> {
  return apiFetch<Introduction[]>('/introductions', { revalidate: 600 })
}

export async function getIntroduction(id: number): Promise<Introduction | null> {
  try {
    return await apiFetch<Introduction>(`/introductions/${id}`, { revalidate: 600 })
  } catch {
    return null
  }
}

// ── Members ───────────────────────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  return apiFetch<Member[]>('/members', { revalidate: 300 })
}

// ── Public Events ─────────────────────────────────────────────────────────

export async function getPublicEvents(): Promise<PublicEvent[]> {
  return apiFetch<PublicEvent[]>('/public-events', { revalidate: 300 })
}

// ── Posts ─────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  return apiFetch<Post[]>('/posts', { revalidate: 300 })
}

// ── Blogs & Keywords ──────────────────────────────────────────────────────

export async function getBlogs(params?: { title?: string; keyword?: string }): Promise<Blog[]> {
  const searchParams = new URLSearchParams()
  if (params?.title) searchParams.set('title', params.title)
  if (params?.keyword) searchParams.set('keyword', params.keyword)
  const qs = searchParams.toString()
  return apiFetch<Blog[]>(`/blogs${qs ? `?${qs}` : ''}`, { revalidate: 300 })
}

export async function getFeaturedBlogs(limit = 5): Promise<Blog[]> {
  return apiFetch<Blog[]>(`/blogs/top-viewed?limit=${limit}`, { revalidate: 300 })
}

export async function getTopAuthors(limit = 50): Promise<AuthorStats[]> {
  return apiFetch<AuthorStats[]>(`/blogs/top-authors?limit=${limit}`, { revalidate: 300 })
}

export async function getAuthorStats(authorName: string): Promise<AuthorStats | null> {
  try {
    const authors = await getTopAuthors()
    return authors.find((a) => a.name === authorName) ?? null
  } catch {
    return null
  }
}

export async function getBlogKeywords(): Promise<BlogKeyword[]> {
  return apiFetch<BlogKeyword[]>('/keywords', { revalidate: 600 })
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    return await apiFetch<Blog>(`/blogs/by-slug/${encodeURIComponent(slug)}`, { revalidate: 60 })
  } catch {
    return null
  }
}

// ── Homepage ───────────────────────────────────────────────────────────────

export async function getHomePageData(): Promise<HomePageData> {
  return apiFetch<HomePageData>('/homepage', { revalidate: 300 })
}
