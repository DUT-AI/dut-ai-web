import { getHomePageDataCached as getHomePageData } from '@/lib/db/cached-queries'
import type { HomePageData } from '@/lib/db/features/homepage/types'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import RoadmapSection from '@/components/home/RoadmapSection'
import PortfolioSection from '@/components/home/PortfolioSection'
import MomentsSection from '@/components/home/MomentsSection'
import NewsSection from '@/components/home/NewsSection'
import BlogSection from '@/components/home/BlogSection'
import CTASection from '@/components/home/CTASection'
import { genPageMetadata } from './seo'

export const metadata = genPageMetadata({
  title: 'DUT AI Club',
  description:
    'DUT AI Club là cộng đồng sinh viên đam mê trí tuệ nhân tạo tại Đại học Bách khoa - Đại học Đà Nẵng, cùng học tập, nghiên cứu và phát triển dự án AI.',
  path: '/',
})

export default async function Page() {
  let data: HomePageData = {
    latest_blogs: [],
    latest_events: [],
    latest_projects: [],
    latest_posts: [],
  }

  try {
    data = await getHomePageData()
  } catch (error) {
    console.error('Failed to fetch homepage data during build/render:', error)
  }

  const latestPosts = data.latest_posts ?? []
  const latestEvents = data.latest_events ?? []
  const latestBlogs = data.latest_blogs ?? []
  const latestProjects = data.latest_projects ?? []

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f8faff] via-[#fff5f8] to-[#e6f0fa] pb-16 dark:from-gray-950 dark:via-gray-900 dark:to-[#0f172a]">
      {/* Global Background Blobs */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute top-[5%] -left-[10%] h-[20%] w-[60%] rounded-full bg-blue-100/50 mix-blend-multiply blur-[120px] filter dark:bg-blue-900/10" />
        <div className="absolute top-[30%] right-[0%] h-[30%] w-[50%] rounded-full bg-pink-100/50 mix-blend-multiply blur-[120px] filter dark:bg-pink-900/10" />
        <div className="absolute bottom-[20%] -left-[5%] h-[40%] w-[40%] rounded-full bg-blue-200/30 mix-blend-multiply blur-[120px] filter dark:bg-blue-800/10" />
        <div className="absolute right-[10%] bottom-[0%] h-[30%] w-[60%] rounded-full bg-pink-200/40 mix-blend-multiply blur-[100px] filter dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-20 lg:gap-28">
        <HeroSection />
        <RoadmapSection />
        <PortfolioSection projects={latestProjects} />
        <MomentsSection posts={latestPosts} />
        <NewsSection events={latestEvents} />
        <BlogSection blogs={latestBlogs} />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
