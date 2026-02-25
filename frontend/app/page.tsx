import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import RoadmapSection from '@/components/home/RoadmapSection'
import PortfolioSection from '@/components/home/PortfolioSection'
import MomentsSection from '@/components/home/MomentsSection'
import NewsSection from '@/components/home/NewsSection'
import CTASection from '@/components/home/CTASection'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return (
    <div className="min-h-screen pb-16 relative bg-gradient-to-b from-[#f8faff] via-[#fff5f8] to-[#e6f0fa] dark:from-gray-950 dark:via-gray-900 dark:to-[#0f172a]">
      {/* Global Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] -left-[10%] w-[60%] h-[20%] rounded-full bg-blue-100/50 mix-blend-multiply filter blur-[120px] dark:bg-blue-900/10" />
        <div className="absolute top-[30%] right-[0%] w-[50%] h-[30%] rounded-full bg-pink-100/50 mix-blend-multiply filter blur-[120px] dark:bg-pink-900/10" />
        <div className="absolute bottom-[20%] -left-[5%] w-[40%] h-[40%] rounded-full bg-blue-200/30 mix-blend-multiply filter blur-[120px] dark:bg-blue-800/10" />
        <div className="absolute bottom-[0%] right-[10%] w-[60%] h-[30%] rounded-full bg-pink-200/40 mix-blend-multiply filter blur-[100px] dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 w-full">
        <HeroSection />
        <RoadmapSection />
        <PortfolioSection />
        <MomentsSection />
        <NewsSection posts={posts.slice(0, 3)} />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}