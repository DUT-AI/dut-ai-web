'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createPostQuery,
  createPublicEventQuery,
  deletePostQuery,
  deletePublicEventQuery,
  getPostByIdQuery,
  getPublicEventByIdQuery,
  isEventImageUrlReferencedQuery,
  updatePostQuery,
  updatePublicEventQuery,
} from '@/lib/db/features/events/queries'
import { getAdminSession } from '@/lib/admin-auth'
import { deleteEventImageFromMinIO } from '@/lib/minio'

function optionalText(formData: FormData, name: string): string | null {
  const value = formData.get(name)
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function parseOptionalId(formData: FormData): number | null | 'invalid' {
  const value = formData.get('id')
  if (value === null || value === '') return null
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return 'invalid'

  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : 'invalid'
}

function parseLocalTimestamp(value: string | null): string | null | 'invalid' {
  if (!value) return null

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value)
  if (!match) return 'invalid'

  const [, year, month, day, hour, minute, second = '00'] = match
  const monthNumber = Number(month)
  const dayNumber = Number(day)
  const daysInMonth = new Date(Date.UTC(Number(year), monthNumber, 0)).getUTCDate()
  if (
    monthNumber < 1 ||
    monthNumber > 12 ||
    dayNumber < 1 ||
    dayNumber > daysInMonth ||
    Number(hour) > 23 ||
    Number(minute) > 59 ||
    Number(second) > 59
  ) {
    return 'invalid'
  }

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

async function cleanupUnreferencedImages(urls: Array<string | null | undefined>) {
  for (const url of new Set(urls.filter((value): value is string => Boolean(value)))) {
    try {
      if (!(await isEventImageUrlReferencedQuery(url))) {
        await deleteEventImageFromMinIO(url)
      }
    } catch (error) {
      // The database mutation already succeeded. Storage cleanup is best-effort
      // and must not turn a successful save/delete into a false UI failure.
      console.error(`Failed to clean up Event/Moment image ${url}:`, error)
    }
  }
}

export async function savePublicEventAction(_prevState: unknown, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const id = parseOptionalId(formData)
  if (id === 'invalid') return { error: 'ID sự kiện không hợp lệ.' }

  const title = optionalText(formData, 'title')
  const summary = optionalText(formData, 'summary')
  const description = optionalText(formData, 'description')
  const imgUrl = optionalText(formData, 'imgUrl')
  const location = optionalText(formData, 'location')
  const registerLink = optionalText(formData, 'registerLink')
  const facebookUrl = optionalText(formData, 'facebookUrl')
  const eventsDate = parseLocalTimestamp(optionalText(formData, 'eventsDate'))
  const tagsRaw = optionalText(formData, 'tags')
  const tags = tagsRaw
    ? [
        ...new Set(
          tagsRaw
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        ),
      ]
    : []

  if (!title) return { error: 'Tiêu đề sự kiện không được để trống.' }
  if (title.length > 255) return { error: 'Tiêu đề sự kiện không được vượt quá 255 ký tự.' }
  if (location && location.length > 255) return { error: 'Địa điểm không được vượt quá 255 ký tự.' }
  if (eventsDate === 'invalid') return { error: 'Ngày giờ sự kiện không hợp lệ.' }

  for (const [label, value] of [
    ['URL ảnh', imgUrl],
    ['Link đăng ký', registerLink],
    ['Link Facebook', facebookUrl],
  ] as const) {
    if (value && !isHttpUrl(value)) return { error: `${label} phải là URL HTTP/HTTPS hợp lệ.` }
    if (value && value.length > 1000) return { error: `${label} không được vượt quá 1000 ký tự.` }
  }

  try {
    let oldImageUrl: string | undefined
    if (id !== null) {
      const existing = await getPublicEventByIdQuery(id)
      if (!existing) return { error: 'Không tìm thấy sự kiện cần cập nhật.' }
      oldImageUrl = existing.img_url

      const updated = await updatePublicEventQuery(id, {
        title,
        summary,
        description,
        imgUrl,
        location,
        registerLink,
        facebookUrl,
        eventsDate,
        tags,
      })
      if (!updated) return { error: 'Không tìm thấy sự kiện cần cập nhật.' }
    } else {
      await createPublicEventQuery({
        title,
        summary,
        description,
        imgUrl,
        location,
        registerLink,
        facebookUrl,
        eventsDate,
        tags,
      })
    }

    updateTag('events')
    if (oldImageUrl && oldImageUrl !== imgUrl) await cleanupUnreferencedImages([oldImageUrl])
  } catch (error) {
    console.error('Failed to save public event:', error)
    return { error: errorMessage(error, 'Lỗi khi lưu sự kiện.') }
  }

  redirect('/admin/events')
}

export async function deletePublicEventAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) return { error: 'Bạn không có quyền thực hiện hành động này.' }
  if (!Number.isSafeInteger(id) || id <= 0) return { error: 'ID sự kiện không hợp lệ.' }

  try {
    const existing = await getPublicEventByIdQuery(id)
    if (!existing) return { error: 'Không tìm thấy sự kiện cần xóa.' }

    const deleted = await deletePublicEventQuery(id)
    if (!deleted) return { error: 'Không tìm thấy sự kiện cần xóa.' }

    updateTag('events')
    await cleanupUnreferencedImages([existing.img_url])
    return { success: true }
  } catch (error) {
    console.error('Failed to delete public event:', error)
    return { error: errorMessage(error, 'Lỗi khi xóa sự kiện.') }
  }
}

export async function savePostAction(_prevState: unknown, formData: FormData) {
  const session = await getAdminSession()
  if (!session.authenticated) {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const id = parseOptionalId(formData)
  if (id === 'invalid') return { error: 'ID khoảnh khắc không hợp lệ.' }

  const title = optionalText(formData, 'title')
  const summary = optionalText(formData, 'summary')
  const description = optionalText(formData, 'description')
  const hashtag = optionalText(formData, 'hashtag')
  const facebookUrl = optionalText(formData, 'facebookUrl')
  const eventsDate = parseLocalTimestamp(optionalText(formData, 'eventsDate'))
  const imgUrlsRaw = optionalText(formData, 'imgUrls')
  const imgUrls = imgUrlsRaw
    ? [
        ...new Set(
          imgUrlsRaw
            .split('\n')
            .map((url) => url.trim())
            .filter(Boolean)
        ),
      ]
    : []

  if (!title) return { error: 'Tiêu đề khoảnh khắc không được để trống.' }
  if (title.length > 255) return { error: 'Tiêu đề khoảnh khắc không được vượt quá 255 ký tự.' }
  if (hashtag && hashtag.length > 255) return { error: 'Hashtag không được vượt quá 255 ký tự.' }
  if (eventsDate === 'invalid') return { error: 'Ngày giờ khoảnh khắc không hợp lệ.' }
  if (facebookUrl && (!isHttpUrl(facebookUrl) || facebookUrl.length > 1000)) {
    return { error: 'Link Facebook phải là URL HTTP/HTTPS hợp lệ và không quá 1000 ký tự.' }
  }
  if (imgUrls.some((url) => !isHttpUrl(url))) {
    return { error: 'Mỗi URL ảnh phải là URL HTTP/HTTPS hợp lệ.' }
  }

  try {
    let removedImages: string[] = []
    if (id !== null) {
      const existing = await getPostByIdQuery(id)
      if (!existing) return { error: 'Không tìm thấy khoảnh khắc cần cập nhật.' }
      const nextImages = new Set(imgUrls)
      removedImages = (existing.img_urls ?? []).filter((url) => !nextImages.has(url))

      const updated = await updatePostQuery(id, {
        title,
        summary,
        description,
        hashtag,
        facebookUrl,
        eventsDate,
        imgUrls,
      })
      if (!updated) return { error: 'Không tìm thấy khoảnh khắc cần cập nhật.' }
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

    updateTag('events')
    await cleanupUnreferencedImages(removedImages)
  } catch (error) {
    console.error('Failed to save post moment:', error)
    return { error: errorMessage(error, 'Lỗi khi lưu khoảnh khắc.') }
  }

  redirect('/admin/posts')
}

export async function deletePostAction(id: number) {
  const session = await getAdminSession()
  if (!session.authenticated) return { error: 'Bạn không có quyền thực hiện hành động này.' }
  if (!Number.isSafeInteger(id) || id <= 0) return { error: 'ID khoảnh khắc không hợp lệ.' }

  try {
    const existing = await getPostByIdQuery(id)
    if (!existing) return { error: 'Không tìm thấy khoảnh khắc cần xóa.' }

    const deleted = await deletePostQuery(id)
    if (!deleted) return { error: 'Không tìm thấy khoảnh khắc cần xóa.' }

    updateTag('events')
    await cleanupUnreferencedImages(existing.img_urls ?? [])
    return { success: true }
  } catch (error) {
    console.error('Failed to delete post moment:', error)
    return { error: errorMessage(error, 'Lỗi khi xóa khoảnh khắc.') }
  }
}
