import { notFound } from 'next/navigation'
import { getPostByIdQuery } from '@/lib/db/features/events/queries'
import PostForm from '@/app/admin/posts/PostForm'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const postId = Number(idStr)
  if (!/^\d+$/.test(idStr) || !Number.isSafeInteger(postId) || postId <= 0) notFound()

  const post = await getPostByIdQuery(postId)
  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Chỉnh sửa Khoảnh khắc
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa bài đăng khoảnh khắc #{post.id} ({post.title})
        </p>
      </div>

      <PostForm initialPost={post} />
    </div>
  )
}
