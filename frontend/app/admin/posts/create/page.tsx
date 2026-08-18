import PostForm from '@/app/admin/posts/PostForm'

export const dynamic = 'force-dynamic'

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Thêm Khoảnh khắc Mới
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Lưu giữ những hình ảnh kỷ niệm và hoạt động của câu lạc bộ
        </p>
      </div>

      <PostForm />
    </div>
  )
}
