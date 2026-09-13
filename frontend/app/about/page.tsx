import { genPageMetadata } from 'app/seo'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutStory from '@/components/about/AboutStory'
import AboutCoreValues from '@/components/about/AboutCoreValues'
import GenerationAlbum from '@/components/about/GenerationAlbum'
import { getGenerationAlbumsQuery } from '@/lib/db/features/organization/queries'
import { getManageUsers } from '@/lib/manage-users'
import type { GenerationAlbum as GenerationAlbumData } from '@/lib/db/features/organization/types'
import type { Member } from '@/lib/db/features/users/types'

export const metadata = genPageMetadata({
  title: 'Về chúng mình | DUT AI Club',
  description:
    'Khám phá các thế hệ và những con người đã cùng nhau tạo nên hành trình của DUT AI Club.',
})

export const dynamic = 'force-dynamic'

function fallbackAlbum(users: Member[]): GenerationAlbumData {
  const departments = [
    { id: -1, name: 'Ban Chủ nhiệm', match: (roles: string[]) => roles.includes('admin') },
    {
      id: -2,
      name: 'Đội ngũ Leader',
      match: (roles: string[]) => roles.includes('leader') && !roles.includes('admin'),
    },
    {
      id: -3,
      name: 'Thành viên',
      match: (roles: string[]) => !roles.includes('admin') && !roles.includes('leader'),
    },
  ]

  return {
    id: -1,
    name: 'DUT AI',
    slug: 'dut-ai-current',
    period: 'Thế hệ hiện tại',
    description:
      'Những gương mặt đang cùng nhau viết tiếp hành trình học hỏi và sáng tạo tại DUT AI Club.',
    accent_color: '#1d4ed8',
    display_order: 0,
    is_published: true,
    departments: departments.map((department, departmentIndex) => ({
      id: department.id,
      name: department.name,
      accent_color: '#2563eb',
      display_order: departmentIndex,
      members: users
        .filter((user) =>
          department.match((user.role_names || [user.role_name]).map((role) => role.toLowerCase()))
        )
        .map((user, memberIndex) => ({
          ...user,
          title:
            (user.role_names || [user.role_name])
              .filter((role) => role.toLowerCase() !== 'teammate')
              .join(' · ') || 'Thành viên',
          display_order: memberIndex,
          is_featured: false,
        })),
    })),
  }
}

export default async function AboutPage() {
  let albums = await getGenerationAlbumsQuery({ publishedOnly: true }).catch((error) => {
    console.error('Failed to load generation albums:', error)
    return []
  })

  if (albums.length === 0) {
    const users = await getManageUsers().catch(() => [])
    if (users.length > 0) albums = [fallbackAlbum(users)]
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f8faff] via-[#fff5f8] to-[#e6f0fa] pb-16 dark:from-gray-950 dark:via-gray-900 dark:to-[#0f172a]">
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute top-[5%] -left-[10%] h-[20%] w-[60%] rounded-full bg-blue-100/50 blur-[120px] dark:bg-blue-900/10" />
        <div className="absolute top-[30%] right-0 h-[30%] w-[50%] rounded-full bg-pink-100/50 blur-[120px] dark:bg-pink-900/10" />
        <div className="absolute bottom-[20%] -left-[5%] h-[40%] w-[40%] rounded-full bg-blue-200/30 blur-[120px] dark:bg-blue-800/10" />
      </div>

      <div className="relative z-10">
        <AboutHero
          eyebrow="CÂU CHUYỆN CỦA CHÚNG TÔI"
          titleTop="ABOUT"
          titleBottom="DUT AI CLUB"
          description="Nơi những bộ óc sáng tạo gặp gỡ, cùng nhau khám phá và làm chủ sức mạnh của Trí tuệ Nhân tạo."
        />

        <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8 md:px-12">
          <AboutStory />
          <AboutCoreValues />
          <GenerationAlbum albums={albums} />
          <Footer />
        </div>
      </div>
    </div>
  )
}
