import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import AboutUs from '@/components/AboutUs'
import OrgSystem from '@/components/OrgSystem'
import EventImagePool from '@/components/EventImagePool'

export default async function Page() {
  // 1. Lấy dữ liệu bài viết (dùng cho phần Blog/Sự kiện phía dưới)
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Phần tiêu đề chính */}
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Chào mừng đến với DUT AI
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Nghiên cứu - Sáng tạo - Kết nối cộng đồng AI
        </p>
      </div>

      {/* 2. Section About Us (Markdown) */}
      <div className="py-10">
        <AboutUs />
      </div>

      {/* 3. Section Hệ thống (3 Role) - Bạn có thể chèn component Hệ thống ở đây */}
      <div className="py-10">
        <OrgSystem />
      </div>
      {/* Section Pool Ảnh Sự Kiện */}

      <div className="py-10">
        <EventImagePool posts={posts} />
      </div>
      {/* 4. Section Blog/Sự kiện có sẵn của Template */}
      <div className="py-10">
        <h2 className="text-2xl font-bold mb-6">Sự kiện & Tin tức mới nhất</h2>
        <Main posts={posts.slice(0, 3)} />
      </div>
    </div>
  )
}