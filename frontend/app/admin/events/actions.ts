'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createPublicEventQuery,
  updatePublicEventQuery,
  deletePublicEventQuery,
  createPostQuery,
  updatePostQuery,
  deletePostQuery,
} from '@/lib/db/features/events/queries'
import { getAdminSession } from '@/lib/admin-auth'

// ── Public Events Actions ──────────────────────────────────────────────────

export async function savePublicEventAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined

  const title = (formData.get('title') as string)?.trim()
  const summary = (formData.get('summary') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const imgUrl = (formData.get('imgUrl') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const registerLink = (formData.get('registerLink') as string)?.trim()
  const facebookUrl = (formData.get('facebookUrl') as string)?.trim()
  const eventsDateStr = (formData.get('eventsDate') as string)?.trim()
  const tagsRaw = (formData.get('tags') as string)?.trim()

  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
  const eventsDate = eventsDateStr ? new Date(eventsDateStr) : undefined

  if (!title) {
    return { error: 'Tiêu đề sự kiện không được để trống.' }
  }

  try {
    if (id) {
      await updatePublicEventQuery(id, {
        title,
        summary,
        description,
        imgUrl: imgUrl || undefined,
        location,
        registerLink,
        facebookUrl,
        eventsDate,
        tags,
      })
    } else {
      await createPublicEventQuery({
        title,
        summary,
        description,
        imgUrl: imgUrl || undefined,
        location,
        registerLink,
        facebookUrl,
        eventsDate,
        tags,
      })
    }

    revalidateTag('events', 'homepage')
  } catch (error: any) {
    console.error('Failed to save public event:', error)
    return { error: error?.message || 'Lỗi khi lưu sự kiện.' }
  }

  redirect('/admin/events')
}

export async function deletePublicEventAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('Unauthorized')
  }

  await deletePublicEventQuery(id)
  revalidateTag('events', 'homepage')
  redirect('/admin/events')
}

// ── Posts (Moments) Actions ────────────────────────────────────────────────

export async function savePostAction(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const idStr = formData.get('id') as string
  const id = idStr ? parseInt(idStr, 10) : undefined

  const title = (formData.get('title') as string)?.trim()
  const summary = (formData.get('summary') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const hashtag = (formData.get('hashtag') as string)?.trim()
  const facebookUrl = (formData.get('facebookUrl') as string)?.trim()
  const eventsDateStr = (formData.get('eventsDate') as string)?.trim()
  const imgUrlsRaw = (formData.get('imgUrls') as string)?.trim()

  const imgUrls = imgUrlsRaw ? imgUrlsRaw.split('\n').map((u) => u.trim()).filter(Boolean) : []
  const eventsDate = eventsDateStr ? new Date(eventsDateStr) : undefined

  if (!title) {
    return { error: 'Tiêu đề bài đăng không được để trống.' }
  }

  try {
    if (id) {
      await updatePostQuery(id, {
        title,
        summary,
        description,
        hashtag,
        facebookUrl,
        eventsDate,
        imgUrls,
      })
    } else {
      await createPostQuery({
        title,
        summary,
        description,
        hashtag,
        facebookUrl,
        eventsDate,
        imgUrls,
      })
    }

    revalidateTag('events', 'homepage')
  } catch (error: any) {
    console.error('Failed to save post moment:', error)
    return { error: error?.message || 'Lỗi khi lưu khoảnh khắc.' }
  }

  redirect('/admin/posts')
}

export async function deletePostAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    throw new Error('Unauthorized')
  }

  await deletePostQuery(id)
  revalidateTag('events', 'homepage')
  redirect('/admin/posts')
}
