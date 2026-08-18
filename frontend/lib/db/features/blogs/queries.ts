import { desc, eq, ilike, sql } from 'drizzle-orm'
import { db } from '../../index'
import { formatDate } from '../../utils'
import { blogs, blogAuthors, blogKeywords } from './schema'
import { users } from '../users/schema'
import { keywords } from '../keywords/schema'
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

export async function getBlogByIdQuery(id: number): Promise<BlogResponse | null> {
  const b = await db.query.blogs.findFirst({
    where: eq(blogs.id, id),
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

export async function createBlogQuery(data: {
  title: string
  slug: string
  summary?: string
  imageUrl?: string
  authorIds?: number[]
  keywordIds?: number[]
}): Promise<number> {
  const [created] = await db
    .insert(blogs)
    .values({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      imageUrl: data.imageUrl,
    })
    .returning({ id: blogs.id })

  if (data.authorIds && data.authorIds.length > 0) {
    await db.insert(blogAuthors).values(
      data.authorIds.map((userId) => ({
        blogId: created.id,
        userId,
      }))
    )
  }

  if (data.keywordIds && data.keywordIds.length > 0) {
    await db.insert(blogKeywords).values(
      data.keywordIds.map((keywordId) => ({
        blogId: created.id,
        keywordId,
      }))
    )
  }

  return created.id
}

export async function updateBlogQuery(
  id: number,
  data: {
    title?: string
    slug?: string
    summary?: string
    imageUrl?: string
    authorIds?: number[]
    keywordIds?: number[]
  }
): Promise<void> {
  await db
    .update(blogs)
    .set({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      imageUrl: data.imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(blogs.id, id))

  if (data.authorIds !== undefined) {
    await db.delete(blogAuthors).where(eq(blogAuthors.blogId, id))
    if (data.authorIds.length > 0) {
      await db.insert(blogAuthors).values(
        data.authorIds.map((userId) => ({
          blogId: id,
          userId,
        }))
      )
    }
  }

  if (data.keywordIds !== undefined) {
    await db.delete(blogKeywords).where(eq(blogKeywords.blogId, id))
    if (data.keywordIds.length > 0) {
      await db.insert(blogKeywords).values(
        data.keywordIds.map((keywordId) => ({
          blogId: id,
          keywordId,
        }))
      )
    }
  }
}

export async function deleteBlogQuery(id: number): Promise<void> {
  await db.delete(blogs).where(eq(blogs.id, id))
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
