import { desc, eq, ilike, sql } from 'drizzle-orm'
import { db } from '../../index'
import { formatDate } from '../../utils'
import { blogs, blogAuthors, blogKeywords } from './schema'
import { getManageUsersMap } from '@/lib/manage-users'
import { uploadToMinIO } from '@/lib/minio'
import type { BlogResponse, AuthorStatsResponse, CreateBlogInput, UpdateBlogInput } from './types'

function mapBlog(b: any, users: Awaited<ReturnType<typeof getManageUsersMap>>): BlogResponse {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug ?? undefined,
    summary: b.summary ?? '',
    content: b.content ?? null,
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

export async function createBlogQuery(data: CreateBlogInput): Promise<number> {
  let imageUrl = data.imageUrl
  if (data.image && data.image.size > 0) {
    const bytes = await data.image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const { url } = await uploadToMinIO(buffer, data.image.name, data.image.type, 'blogs')
    imageUrl = url
  }

  const [created] = await db
    .insert(blogs)
    .values({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      imageUrl: imageUrl ?? null,
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

export async function updateBlogQuery(id: number, data: UpdateBlogInput): Promise<void> {
  const updateValues: Record<string, any> = {
    updatedAt: new Date(),
  }
  if (data.title !== undefined) updateValues.title = data.title
  if (data.slug !== undefined) updateValues.slug = data.slug
  if (data.summary !== undefined) updateValues.summary = data.summary
  if (data.content !== undefined) updateValues.content = data.content

  if (data.image !== undefined) {
    if (data.image && data.image.size > 0) {
      const bytes = await data.image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const { url } = await uploadToMinIO(buffer, data.image.name, data.image.type, 'blogs')
      updateValues.imageUrl = url
    } else if (data.image === null) {
      updateValues.imageUrl = null
    }
  } else if (data.imageUrl !== undefined) {
    updateValues.imageUrl = data.imageUrl
  }

  await db
    .update(blogs)
    .set(updateValues)
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

export async function incrementBlogViewsQuery(params: {
  id?: number
  slug?: string
}): Promise<number | null> {
  const condition = params.id
    ? eq(blogs.id, params.id)
    : params.slug
      ? eq(blogs.slug, params.slug)
      : null

  if (!condition) return null

  const [updated] = await db
    .update(blogs)
    .set({
      views: sql`COALESCE(${blogs.views}, 0) + 1`,
    })
    .where(condition)
    .returning({ views: blogs.views })

  return updated?.views ?? null
}

