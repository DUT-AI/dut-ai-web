'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createBlogQuery,
  updateBlogQuery,
  deleteBlogQuery,
} from '@/lib/db/features/blogs/queries'
import { createKeywordQuery } from '@/lib/db/features/keywords/queries'
import { keywords } from '@/lib/db/features/keywords/schema'
import { db } from '@/lib/db'
import { ilike } from 'drizzle-orm'
import { getAdminSession } from '@/lib/admin-auth'

export async function saveBlogAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined

  const title = (formData.get('title') as string)?.trim()
  const slug = (formData.get('slug') as string)?.trim()
  const summary = (formData.get('summary') as string)?.trim()
  const content = (formData.get('content') as string)?.trim() || ''
  const imageRaw = formData.get('image')
  const image = imageRaw instanceof File && imageRaw.size > 0 ? imageRaw : undefined
  const imageUrlRaw = (formData.get('imageUrl') as string)?.trim()
  const imageUrl = imageUrlRaw || null

  const authorIdsRaw = formData.getAll('authorIds') as string[]
  const authorIds = authorIdsRaw.map((x) => parseInt(x, 10)).filter((x) => !isNaN(x))

  const keywordIdsRaw = formData.getAll('keywordIds') as string[]
  const keywordIds = keywordIdsRaw.map((x) => parseInt(x, 10)).filter((x) => !isNaN(x))

  if (!title) {
    return { error: 'Tiêu đề bài viết không được để trống.' }
  }
  if (!slug) {
    return { error: 'Đường dẫn (Slug) bài viết không được để trống.' }
  }

  try {
    if (id) {
      await updateBlogQuery(id, {
        title,
        slug,
        summary,
        content,
        image,
        imageUrl: image ? undefined : (imageUrl ? imageUrl : null),
        authorIds,
        keywordIds,
      })
    } else {
      await createBlogQuery({
        title,
        slug,
        summary,
        content,
        image,
        imageUrl: image ? undefined : imageUrl,
        authorIds,
        keywordIds,
      })
    }

    revalidateTag('blogs', 'max')
    revalidateTag('homepage', 'max')
  } catch (error: any) {
    console.error('Failed to save blog:', error)
    return { error: error?.message || 'Lỗi khi lưu bài viết.' }
  }

  redirect('/admin/blogs')
}

export async function deleteBlogAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('Unauthorized')
  }

  await deleteBlogQuery(id)
  revalidateTag('blogs', 'max')
  revalidateTag('homepage', 'max')
  redirect('/admin/blogs')
}

export async function createKeywordInlineAction(keywordName: string) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const cleanName = keywordName.trim()
  if (!cleanName) {
    return { error: 'Tên từ khóa không được để trống.' }
  }

  try {
    const newId = await createKeywordQuery(cleanName)
    revalidateTag('blogs', 'default')
    return {
      data: {
        id: newId,
        keyword_name: cleanName,
        number_blog_contain: 0,
      },
    }
  } catch (err: any) {
    console.error('Lỗi khi tạo từ khóa inline:', err)
    return { error: 'Không thể tạo từ khóa mới lúc này. Vui lòng thử lại.' }
  }
}
