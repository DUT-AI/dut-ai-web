import { desc, eq, ilike, sql } from 'drizzle-orm'
import { db } from '../../index'
import { formatDate } from '../../utils'
import { blogs, blogAuthors, blogKeywords } from './schema'
import { getManageUsersMap } from '@/lib/manage-users'
import type { BlogResponse, AuthorStatsResponse } from './types'

function mapBlog(b: any, users: Awaited<ReturnType<typeof getManageUsersMap>>): BlogResponse {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug ?? undefined,
    summary: b.summary ?? '',
    views: b.views ?? 0,
    image_url: b.imageUrl ?? undefined,
    created_at: formatDate(b.createdAt) ?? new Date().toISOString(),
    updated_at: formatDate(b.updatedAt) ?? new Date().toISOString(),
    authors: b.blogAuthors.map((author: any) => {
      const user = users.get(author.externalUserId)
      return {
        id: author.externalUserId,
        name: user?.name ?? 'Tác giả chưa đồng bộ',
        avatar_url: user?.avatar_url,
      }
    }),
    keywords: b.blogKeywords
      .filter((item: any) => Boolean(item.keyword))
      .map((item: any) => ({
        id: item.keyword.id,
        keyword_name: item.keyword.keywordName,
        number_blog_contain: item.keyword.numberBlogContain ?? 0,
      })),
  }
}

const blogRelations = {
  blogAuthors: true,
  blogKeywords: { with: { keyword: true } },
} as const

export async function getBlogsQuery(params?: {
  title?: string
  keyword?: string
}): Promise<BlogResponse[]> {
  const [blogList, users] = await Promise.all([
    db.query.blogs.findMany({
      where: params?.title ? ilike(blogs.title, `%${params.title}%`) : undefined,
      orderBy: [desc(blogs.createdAt), desc(blogs.id)],
      with: blogRelations,
    }),
    getManageUsersMap(),
  ])

  const filtered = params?.keyword
    ? blogList.filter((blog) =>
        blog.blogKeywords.some((item) =>
          item.keyword?.keywordName?.toLowerCase().includes(params.keyword!.toLowerCase())
        )
      )
    : blogList

  return filtered.map((blog) => mapBlog(blog, users))
}

export async function getBlogByIdQuery(id: number): Promise<BlogResponse | null> {
  const [blog, users] = await Promise.all([
    db.query.blogs.findFirst({
      where: eq(blogs.id, id),
      with: blogRelations,
    }),
    getManageUsersMap(),
  ])
  return blog ? mapBlog(blog, users) : null
}

export async function getBlogBySlugQuery(slug: string): Promise<BlogResponse | null> {
  const [blog, users] = await Promise.all([
    db.query.blogs.findFirst({
      where: eq(blogs.slug, slug),
      with: blogRelations,
    }),
    getManageUsersMap(),
  ])
  return blog ? mapBlog(blog, users) : null
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

  if (data.authorIds?.length) {
    await db.insert(blogAuthors).values(
      data.authorIds.map((externalUserId) => ({
        blogId: created.id,
        externalUserId,
      }))
    )
  }

  if (data.keywordIds?.length) {
    await db
      .insert(blogKeywords)
      .values(data.keywordIds.map((keywordId) => ({ blogId: created.id, keywordId })))
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
      await db
        .insert(blogAuthors)
        .values(data.authorIds.map((externalUserId) => ({ blogId: id, externalUserId })))
    }
  }

  if (data.keywordIds !== undefined) {
    await db.delete(blogKeywords).where(eq(blogKeywords.blogId, id))
    if (data.keywordIds.length > 0) {
      await db
        .insert(blogKeywords)
        .values(data.keywordIds.map((keywordId) => ({ blogId: id, keywordId })))
    }
  }
}

export async function deleteBlogQuery(id: number): Promise<void> {
  await db.delete(blogs).where(eq(blogs.id, id))
}

export async function getFeaturedBlogsQuery(limit = 5): Promise<BlogResponse[]> {
  const [featured, users] = await Promise.all([
    db.query.blogs.findMany({
      orderBy: [desc(blogs.views), desc(blogs.id)],
      limit,
      with: blogRelations,
    }),
    getManageUsersMap(),
  ])

  return featured.map((blog) => mapBlog(blog, users))
}

export async function getTopAuthorsQuery(limit = 50): Promise<AuthorStatsResponse[]> {
  const [rows, users] = await Promise.all([
    db
      .select({
        id: blogAuthors.externalUserId,
        totalViews: sql<number>`COALESCE(SUM(${blogs.views}), 0)::int`,
        postCount: sql<number>`COUNT(${blogs.id})::int`,
      })
      .from(blogAuthors)
      .innerJoin(blogs, eq(blogAuthors.blogId, blogs.id))
      .groupBy(blogAuthors.externalUserId)
      .orderBy(desc(sql`SUM(${blogs.views})`))
      .limit(limit),
    getManageUsersMap(),
  ])

  return rows.map((row) => ({
    id: row.id,
    name: users.get(row.id)?.name ?? 'Tác giả chưa đồng bộ',
    avatar_url: users.get(row.id)?.avatar_url,
    total_views: Number(row.totalViews),
    post_count: Number(row.postCount),
  }))
}
