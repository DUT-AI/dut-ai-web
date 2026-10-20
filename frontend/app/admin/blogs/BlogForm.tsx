'use client'

import { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft, Wand2, FileArchive } from 'lucide-react'
import Link from 'next/link'
import { slug as slugify } from 'github-slugger'
import { saveBlogAction } from './actions'
import { blogFormSchema, type BlogFormValues } from './schema'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import NotionZipImportDialog, {
  type NotionImportSuccessPayload,
} from '@/components/admin/NotionZipImportDialog'
import BlogCoverImageSection from './components/BlogCoverImageSection'
import BlogAuthorsSection from './components/BlogAuthorsSection'
import BlogKeywordsSection from './components/BlogKeywordsSection'
import type { Blog } from '@/lib/db/features/blogs/types'
import type { Member } from '@/lib/db/features/users/types'
import type { BlogKeyword } from '@/lib/db/features/keywords/types'

interface BlogFormProps {
  initialBlog?: Blog | null
  authors: Member[]
  keywords: BlogKeyword[]
}

export default function BlogForm({ initialBlog, authors, keywords }: BlogFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isNotionImportOpen, setIsNotionImportOpen] = useState(false)
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialBlog?.title || '',
      slug: initialBlog?.slug || '',
      summary: initialBlog?.summary || '',
      content: initialBlog?.content || '',
      imageUrl: initialBlog?.image_url || '',
      image: null,
      authorIds: initialBlog?.authors?.map((a) => a.id) || [],
      keywordIds: initialBlog?.keywords?.map((k) => k.id) || [],
    },
  })

  // Watch fields needed for reactive UI & preview
  const title = watch('title')
  const slug = watch('slug')
  const content = watch('content')
  const imageUrl = watch('imageUrl')
  const selectedFile = watch('image')
  const selectedAuthors = watch('authorIds')
  const selectedKeywords = watch('keywordIds')

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl)
      }
    }
  }, [previewObjectUrl])

  const handleNotionImportSuccess = (payload: NotionImportSuccessPayload) => {
    setValue('title', payload.title, { shouldValidate: true })
    setValue('slug', payload.slug, { shouldValidate: true })
    if (payload.summary) setValue('summary', payload.summary)
    setValue('content', payload.content, { shouldValidate: true })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle, { shouldValidate: true })
    if (!initialBlog && (!slug || slug === slugify(title))) {
      setValue('slug', slugify(newTitle), { shouldValidate: true })
    }
  }

  const handleAutoSlug = () => {
    if (title) {
      setValue('slug', slugify(title), { shouldValidate: true })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
    }

    setValue('image', file)
    setPreviewObjectUrl(URL.createObjectURL(file))
  }

  const handleClearImage = () => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
    }
    setValue('image', null)
    setValue('imageUrl', '')
    setPreviewObjectUrl(null)
  }

  const toggleAuthor = (id: number) => {
    const next = selectedAuthors.includes(id)
      ? selectedAuthors.filter((x) => x !== id)
      : [...selectedAuthors, id]
    setValue('authorIds', next, { shouldValidate: true })
  }

  const toggleKeyword = (id: number) => {
    const next = selectedKeywords.includes(id)
      ? selectedKeywords.filter((x) => x !== id)
      : [...selectedKeywords, id]
    setValue('keywordIds', next, { shouldValidate: true })
  }

  const onSubmit = (values: BlogFormValues) => {
    setErrorMessage(null)

    const formData = new FormData()
    if (initialBlog?.id) {
      formData.set('id', String(initialBlog.id))
    }
    formData.set('title', values.title)
    formData.set('slug', values.slug)
    formData.set('summary', values.summary || '')
    formData.set('content', values.content || '')
    if (values.image) {
      formData.set('image', values.image)
    }
    formData.set('imageUrl', values.imageUrl || '')
    values.authorIds.forEach((id) => formData.append('authorIds', String(id)))
    values.keywordIds.forEach((id) => formData.append('keywordIds', String(id)))

    startTransition(async () => {
      const res = await saveBlogAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
      }
    })
  }

  // Calculate dynamic OpenGraph Thumbnail
  const selectedAuthorObjects = authors
    .filter((author) => selectedAuthors.includes(author.id))
    .map((author) => ({
      name: author.name,
      avatarUrl: author.avatar_url || null,
    }))

  const thumbnailParams = new URLSearchParams()
  if (title) thumbnailParams.set('title', title)
  if (selectedAuthorObjects.length > 0) {
    thumbnailParams.set('authors', JSON.stringify(selectedAuthorObjects))
  }
  const generatedThumbnailUrl = `/api/og/blog/preview?${thumbnailParams.toString()}`
  const thumbnailPreviewUrl = previewObjectUrl || imageUrl || generatedThumbnailUrl

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <div className="flex items-center gap-3">
          {!initialBlog && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNotionImportOpen(true)}
              className="border-primary-500/30 text-primary-600 hover:bg-primary-50 dark:border-primary-400/30 dark:text-primary-400 dark:hover:bg-primary-950/30 gap-2 text-xs font-semibold sm:text-sm"
            >
              <FileArchive className="h-4 w-4" />
              <span>Nhập từ ZIP Notion</span>
            </Button>
          )}

          <Button type="submit" disabled={isPending} className="gap-2 px-6">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>
              {isPending
                ? selectedFile
                  ? 'Đang tải ảnh & lưu...'
                  : 'Đang lưu bài viết...'
                : initialBlog
                ? 'Cập nhật bài viết'
                : 'Lưu bài viết'}
            </span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Main Metadata Fields */}
      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Thông tin cơ bản bài viết
        </h2>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('title')}
            onChange={handleTitleChange}
            placeholder="Ví dụ: Giới thiệu về Machine Learning và Ứng dụng..."
            className="mt-2 text-base font-semibold"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Đường dẫn (Slug) <span className="text-red-500">*</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAutoSlug}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 h-6 gap-1.5 px-2 text-xs font-semibold"
              title="Tự động tạo slug từ tiêu đề"
            >
              <Wand2 className="text-primary-500 h-4 w-4" />
              <span>Tạo từ tiêu đề</span>
            </Button>
          </div>
          <Input
            {...register('slug')}
            placeholder="vi-du-slug-bai-viet"
            className="mt-2 font-mono text-sm"
          />
          {errors.slug ? (
            <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.slug.message}</p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Định danh URL duy nhất cho bài viết (ví dụ: /blog/nhap-mon-machine-learning).
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
            Tóm tắt ngắn (Summary)
          </label>
          <Textarea
            {...register('summary')}
            placeholder="Tóm tắt ngắn gọn nội dung bài viết hiển thị ở thẻ danh sách và chia sẻ mạng xã hội..."
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Cover Image Upload & Preview Subcomponent */}
        <BlogCoverImageSection
          imageUrl={imageUrl}
          selectedFile={selectedFile ?? null}
          onFileSelect={handleFileSelect}
          onClearImage={handleClearImage}
          thumbnailPreviewUrl={thumbnailPreviewUrl}
          generatedThumbnailUrl={generatedThumbnailUrl}
          isPending={isPending}
        />
      </div>

      {/* Dedicated Markdown Content Editor */}
      <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Nội dung bài viết (Markdown)
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Soạn thảo bằng cú pháp Markdown với thanh công cụ định dạng và chế độ xem trước trực tiếp.
            </p>
          </div>
        </div>

        <MarkdownEditor
          value={content}
          onChange={(val) => setValue('content', val, { shouldValidate: true })}
          placeholder="Nhập nội dung bài viết chi tiết tại đây..."
          minHeight="500px"
          fullscreenOnly
        />
      </div>

      {/* Authors & Keywords Section (2 Columns Grid) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Select Authors Subcomponent */}
        <BlogAuthorsSection
          authors={authors}
          selectedAuthors={selectedAuthors}
          onToggleAuthor={toggleAuthor}
        />

        {/* Select Keywords Subcomponent */}
        <BlogKeywordsSection
          keywords={keywords}
          selectedKeywords={selectedKeywords}
          onToggleKeyword={toggleKeyword}
        />
      </div>

      <NotionZipImportDialog
        isOpen={isNotionImportOpen}
        onClose={() => setIsNotionImportOpen(false)}
        onImportSuccess={handleNotionImportSuccess}
      />
    </form>
  )
}
