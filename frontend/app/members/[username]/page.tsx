import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import PortfolioContainer from '@/features/portfolio/components/PortfolioContainer'
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

  return <PortfolioContainer profile={profile} />
}
