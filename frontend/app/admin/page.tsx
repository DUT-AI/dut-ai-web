import {
  getBlogsQuery,
  getProjectsQuery,
  getMembersQuery,
  getPublicEventsQuery,
  getPostsQuery,
  getBlogKeywordsQuery,
} from '@/lib/db/queries'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, Briefcase, Users, Calendar, Eye, ArrowUpRight, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [blogs, projects, members, events, posts, keywords] = await Promise.all([
    getBlogsQuery().catch(() => [] as any[]),
    getProjectsQuery().catch(() => [] as any[]),
    getMembersQuery().catch(() => [] as any[]),
    getPublicEventsQuery().catch(() => [] as any[]),
    getPostsQuery().catch(() => [] as any[]),
    getBlogKeywordsQuery().catch(() => [] as any[]),
  ])

  const totalViews = (blogs as any[]).reduce((acc: number, b: any) => acc + (Number(b.views) || 0), 0)

  const STATS: { title: string; value: string | number; icon: any; color: string; bg: string; href?: string }[] = [
    { title: 'Bài viết Blog', value: blogs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40', href: '/admin/blogs' },
    { title: 'Tổng lượt xem Blog', value: totalViews.toLocaleString('vi-VN'), icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { title: 'Dự án (Projects)', value: projects.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40', href: '/admin/projects' },
    { title: 'Thành viên CLB', value: members.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40', href: '/admin/users' },
    { title: 'Sự kiện & Moments', value: events.length + posts.length, icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/40', href: '/admin/events' },
  ]

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tổng quan Hệ thống
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Xem nhanh thống kê dữ liệu và truy cập các module quản trị
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/blogs/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Tạo bài viết</span>
            </Button>
          </Link>
          <Link href="/admin/projects/create">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Thêm dự án</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden border-slate-200/80 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {stat.href && (
                    <Link href={stat.href} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Tables Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Blogs */}
        <Card className="border-slate-200/80 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Bài viết gần đây</CardTitle>
              <CardDescription>Danh sách các bài viết blog mới nhất</CardDescription>
            </div>
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>Tất cả</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {blogs.slice(0, 5).map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {blog.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Slug: <code className="text-blue-500">{blog.slug || `#${blog.id}`}</code> • {blog.views} lượt xem
                    </p>
                  </div>
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Sửa
                    </Button>
                  </Link>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-400">Chưa có bài viết nào</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-slate-200/80 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Dự án gần đây</CardTitle>
              <CardDescription>Các dự án AI của câu lạc bộ</CardDescription>
            </div>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>Tất cả</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.slice(0, 5).map((proj) => (
                <div key={proj.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {proj.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                      {proj.technologies || proj.description || 'Dự án AI'}
                    </p>
                  </div>
                  <Link href={`/admin/projects/${proj.id}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Sửa
                    </Button>
                  </Link>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-400">Chưa có dự án nào</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
