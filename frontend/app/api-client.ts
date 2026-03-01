/**
 * Typed API client for the DUT AI FastAPI backend.
 * Always calls through Next.js API proxy routes (server-side),
 * so the real backend URL is kept server-side only.
 */

// Use internal Docker network URL for server-side fetch, public URL for client-side
const BASE = typeof window === 'undefined' 
  ? (process.env.INTERNAL_API_URL || 'http://backend:8002/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'https://dut-ai-web-api.dutai.site/api/v1')

// ── Types ─────────────────────────────────────────────────────────────────

export interface Project {
    id: number
    title: string
    description: string
    href?: string
    imgSrc?: string
    image_url?: string
    github_url?: string
    tags?: string[]
}

export interface Introduction {
    id: number
    title: string
    content: string
    order?: number
}

export interface Member {
    id: number
    name: string
    role_name: string
    avatar_url?: string
    email?: string
    github?: string
    linkedin?: string
}

// ── Fetch helpers (server-side, use API_BASE directly) ────────────────────

async function apiFetch<T>(path: string, options?: RequestInit & { revalidate?: number }): Promise<T> {
    const { revalidate = 300, ...fetchOptions } = options ?? {}
    const res = await fetch(`${BASE}${path}`, {
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

export async function getProject(id: number): Promise<Project> {
    return apiFetch<Project>(`/projects/${id}`, { revalidate: 600 })
}

// ── Introductions ─────────────────────────────────────────────────────────

export async function getIntroductions(): Promise<Introduction[]> {
    return apiFetch<Introduction[]>('/introductions', { revalidate: 600 })
}

export async function getIntroduction(id: number): Promise<Introduction> {
    return apiFetch<Introduction>(`/introductions/${id}`, { revalidate: 600 })
}

// ── Members ───────────────────────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
    return apiFetch<Member[]>('/members', { revalidate: 300 })
}

// ── Public Events (Workshops & Seminars) ─────────────────────────────────

export interface PublicEvent {
    id: number
    title: string
    description?: string
    summary?: string
    img_url?: string
    events_date?: string
    location?: string
    register_link?: string
    facebook_url?: string
    tags?: string[]
    created_at: string
    updated_at: string
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
    return apiFetch<PublicEvent[]>('/public-events', { revalidate: 300 })
}

// ── Posts (Memorable Events) ──────────────────────────────────────────────

export interface Post {
    id: number
    title: string
    description?: string
    summary?: string
    img_urls?: string[]
    hashtag?: string
    events_date?: string
    facebook_url?: string
    created_at: string
    updated_at: string
}

export async function getPosts(): Promise<Post[]> {
    return apiFetch<Post[]>('/posts', { revalidate: 300 })
}

// ── Shared Unified Type ──────────────────────────────────────────────────

export interface PastEvent {
    id: string
    type: 'public_event' | 'post'
    title: string
    summary?: string
    cover?: string
    date?: string
    facebook_url?: string
}
