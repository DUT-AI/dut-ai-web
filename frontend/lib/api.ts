/**
 * Typed API client for the DUT AI FastAPI backend.
 * Always calls through Next.js API proxy routes (server-side),
 * so the real backend URL is kept server-side only.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dut-ai-web-api.dutai.site/api/v1'

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

// ── Author Stats ───────────────────────────────────────────────────────────

export interface AuthorStats {
    author: string
    total_views: number
    post_count: number
}

export async function getTopAuthors(limit = 50): Promise<AuthorStats[]> {
    return apiFetch<AuthorStats[]>(`/blogs/top-authors?limit=${limit}`, { revalidate: 300 })
}

export async function getAuthorStats(authorName: string): Promise<AuthorStats | null> {
    try {
        const authors = await getTopAuthors()
        return authors.find((a) => a.author === authorName) ?? null
    } catch {
        return null
    }
}