import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import Footer from '@/components/layout/Footer'
import PortfolioHero from '@/features/portfolio/components/PortfolioHero'
import PortfolioAbout from '@/features/portfolio/components/PortfolioAbout'
import PortfolioSkills from '@/features/portfolio/components/PortfolioSkills'
import PortfolioProjects from '@/features/portfolio/components/PortfolioProjects'
import PortfolioResume from '@/features/portfolio/components/PortfolioResume'
import { getMemberPortfolioByUsername } from '@/features/users/db/queries'

export const dynamic = 'force-dynamic'

interface MemberPortfolioPageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: MemberPortfolioPageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getMemberPortfolioByUsername(username)

  if (!profile || !profile.isPublic) {
    return genPageMetadata({
      title: 'Thành viên không tồn tại | DUT AI Club',
      description: 'Không tìm thấy thông tin hồ sơ của thành viên này.',
      path: `/members/${username}`,
      noIndex: true,
    })
  }

  const title = `${profile.name} - Hồ sơ cá nhân | DUT AI Club`
  const description =
    profile.headline ||
    profile.quote ||
    profile.bio ||
    `Khám phá hồ sơ chuyên môn, kỹ năng và các dự án của ${profile.name} tại DUT AI Club.`

  return genPageMetadata({
    title,
    absoluteTitle: true,
    description,
    image: profile.avatarUrl || '/static/images/social-banner.png',
    path: `/members/${username}`,
  })
}

export default async function MemberPortfolioPage({ params }: MemberPortfolioPageProps) {
  const { username } = await params
  const profile = await getMemberPortfolioByUsername(username)

  if (!profile || !profile.isPublic) {
    notFound()
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <PortfolioHero
          name={profile.name}
          headline={profile.headline}
          quote={profile.quote}
          avatarUrl={profile.avatarUrl}
          cvUrl={profile.cv?.fileUrl}
          clubRole={profile.clubRole}
          socialLinks={profile.socialLinks}
        />

        {/* About Section */}
        <PortfolioAbout bio={profile.bio} quote={profile.quote} clubRole={profile.clubRole} />

        {/* Skills Section */}
        <PortfolioSkills skills={profile.skills} />

        {/* Projects Section (Unified Club + Personal) */}
        <PortfolioProjects projects={profile.projects} />

        {/* Resume / CV Section */}
        {profile.cv && (
          <PortfolioResume
            cvUrl={profile.cv.fileUrl}
            fileName={profile.cv.fileName}
            fileSize={profile.cv.fileSize}
          />
        )}
      </div>

      <Footer />
    </>
  )
}
