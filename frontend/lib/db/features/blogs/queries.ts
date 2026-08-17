import { desc, eq, ilike, sql } from 'drizzle-orm'
import { db } from '../../index'
import { formatDate } from '../../utils'
import { blogs, blogAuthors } from './schema'
import { users } from '../users/schema'
import { BlogResponse, AuthorStatsResponse } from './types'

export async function getBlogsQuery(params?: {
  title?: string
  keyword?: string
}): Promise<BlogResponse[]> {
  const blogList = await db.query.blogs.findMany({
    where: params?.title ? ilike(blogs.title, `%${params.title}%`) : undefined,
    orderBy: [desc(blogs.createdAt), desc(blogs.id)],
    with: {
      blogAuthors: {
        with: {
          user: true,
        },
      },
      blogKeywords: {
        with: {
          keyword: true,
        },
      },
    },
  })

  let filtered = blogList
  if (params?.keyword) {
    const kwLower = params.keyword.toLowerCase()
    filtered = filtered.filter((b) =>
      b.blogKeywords.some((bk) => bk.keyword?.keywordName?.toLowerCase().includes(kwLower))
    )
  }

  return filtered.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug ?? undefined,
    summary: b.summary ?? '',
    content: b.content,
    views: b.views ?? 0,
    image_url: b.imageUrl ?? undefined,
    created_at: formatDate(b.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(b.updatedAt) ?? new Date().toISOString(),
    authors: b.blogAuthors
      .filter((ba) => Boolean(ba.user))
      .map((ba) => ({
        id: ba.user!.id,
        name: ba.user!.name ?? 'Author',
        avatar_url: ba.user!.avatarUrl ?? undefined,
      })),
    keywords: b.blogKeywords
      .filter((bk) => Boolean(bk.keyword))
      .map((bk) => ({
        id: bk.keyword!.id,
        keyword_name: bk.keyword!.keywordName,
        number_blog_contain: bk.keyword!.numberBlogContain ?? 0,
      })),
  }))
}

export async function getBlogBySlugQuery(slug: string): Promise<BlogResponse | null> {
  const b = await db.query.blogs.findFirst({
    where: eq(blogs.slug, slug),
    with: {
      blogAuthors: {
        with: {
          user: true,
        },
      },
      blogKeywords: {
        with: {
          keyword: true,
        },
      },
    },
  })

  if (!b) return null

  return {
    id: b.id,
    title: b.title,
    slug: b.slug ?? undefined,
    summary: b.summary ?? '',
    content: b.content,
    views: b.views ?? 0,
    image_url: b.imageUrl ?? undefined,
    created_at: formatDate(b.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(b.updatedAt) ?? new Date().toISOString(),
    authors: b.blogAuthors
      .filter((ba) => Boolean(ba.user))
      .map((ba) => ({
        id: ba.user!.id,
        name: ba.user!.name ?? 'Author',
        avatar_url: ba.user!.avatarUrl ?? undefined,
      })),
    keywords: b.blogKeywords
      .filter((bk) => Boolean(bk.keyword))
      .map((bk) => ({
        id: bk.keyword!.id,
        keyword_name: bk.keyword!.keywordName,
        number_blog_contain: bk.keyword!.numberBlogContain ?? 0,
      })),
  }
}

export async function getFeaturedBlogsQuery(limit = 5): Promise<BlogResponse[]> {
  const featured = await db.query.blogs.findMany({
    orderBy: [desc(blogs.views), desc(blogs.id)],
    limit,
    with: {
      blogAuthors: {
        with: {
          user: true,
        },
      },
      blogKeywords: {
        with: {
          keyword: true,
        },
      },
    },
  })

  return featured.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug ?? undefined,
    summary: b.summary ?? '',
    views: b.views ?? 0,
    image_url: b.imageUrl ?? undefined,
    created_at: formatDate(b.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(b.updatedAt) ?? new Date().toISOString(),
    authors: b.blogAuthors
      .filter((ba) => Boolean(ba.user))
      .map((ba) => ({
        id: ba.user!.id,
        name: ba.user!.name ?? 'Author',
        avatar_url: ba.user!.avatarUrl ?? undefined,
      })),
    keywords: b.blogKeywords
      .filter((bk) => Boolean(bk.keyword))
      .map((bk) => ({
        id: bk.keyword!.id,
        keyword_name: bk.keyword!.keywordName,
        number_blog_contain: bk.keyword!.numberBlogContain ?? 0,
      })),
  }))
}

export async function getTopAuthorsQuery(limit = 50): Promise<AuthorStatsResponse[]> {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      totalViews: sql<number>`COALESCE(SUM(${blogs.views}), 0)::int`,
      postCount: sql<number>`COUNT(${blogs.id})::int`,
    })
    .from(users)
    .innerJoin(blogAuthors, eq(users.id, blogAuthors.userId))
    .innerJoin(blogs, eq(blogAuthors.blogId, blogs.id))
    .groupBy(users.id, users.name, users.avatarUrl)
    .orderBy(desc(sql`SUM(${blogs.views})`))
    .limit(limit)

  return rows.map((r) => ({
    id: r.id,
    name: r.name ?? 'Unknown',
    avatar_url: r.avatarUrl ?? undefined,
    total_views: Number(r.totalViews),
    post_count: Number(r.postCount),
  }))
}
