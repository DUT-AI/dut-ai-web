import { Suspense } from 'react'
import { getMembers } from 'app/api-client'
import type { Member } from 'app/api-client'
import { genPageMetadata } from 'app/seo'
import MembersGrid from '@/components/MembersGrid'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutIntroCards from '@/components/about/AboutIntroCards'
import AboutActivities from '@/components/about/AboutActivities'
import AboutVisionMission from '@/components/about/AboutVisionMission'
import AboutCoreValues from '@/components/about/AboutCoreValues'
import AboutLeadership from '@/components/about/AboutLeadership'
import AboutLeadersCarousel from '@/components/about/AboutLeadersCarousel'

type RoleAwareMember = Member & {
    role_id?: number
    status?: string
}

export const metadata = genPageMetadata({
    title: 'Về chúng mình | DUT AI Club',
    description:
        'Gặp gỡ đội ngũ DUT AI Club — Ban chủ nhiệm, Leaders và các thành viên của câu lạc bộ AI tại Đại học Bách khoa Đà Nẵng.',
})

function MembersGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="about-member-card animate-pulse">
                    <div className="about-member-avatar bg-indigo-100/70 dark:bg-white/15" />
                    <div className="mt-3 h-2 w-14 rounded-full bg-indigo-100/80 dark:bg-white/20" />
                </div>
            ))}
        </div>
    )
}

const ADMIN_ROLE_ID = 1
const LEADER_ROLE_ID = 2

function normalizeRoleName(roleName: string | undefined) {
    return (roleName ?? '').trim().toLowerCase()
}

function isAdminRole(member: RoleAwareMember) {
    const roleName = normalizeRoleName(member.role_name)
    return (
        member.role_id === ADMIN_ROLE_ID ||
        roleName === 'admin' ||
        roleName.includes('chủ nhiệm') ||
        roleName.includes('chu nhiem')
    )
}

function isLeaderRole(member: RoleAwareMember) {
    const roleName = normalizeRoleName(member.role_name)
    return (
        member.role_id === LEADER_ROLE_ID || roleName.includes('leader') || roleName.includes('lead')
    )
}

function leadershipPriority(member: RoleAwareMember) {
    const roleName = normalizeRoleName(member.role_name)

    if (roleName.includes('chủ nhiệm') || roleName.includes('chu nhiem')) {
        if (roleName.includes('phó') || roleName.includes('pho') || roleName.includes('vice')) {
            return 2
        }
        return 1
    }

    if (roleName.includes('phó') || roleName.includes('pho') || roleName.includes('vice')) {
        return 2
    }

    return 3
}

function splitMembers(members: RoleAwareMember[]) {
    const activeMembers = members.filter((member) => member.status === 'active')
    const admins = activeMembers
        .filter(isAdminRole)
        .sort((a, b) => {
            const priorityDiff = leadershipPriority(a) - leadershipPriority(b)
            if (priorityDiff !== 0) return priorityDiff
            return a.id - b.id
        })
        .slice(0, 3)

    const adminIds = new Set(admins.map((member) => member.id))
    const leaders = activeMembers.filter((member) => isLeaderRole(member) && !adminIds.has(member.id))

    return { admins, leaders }
}

export default async function AboutPage() {
    let members: Member[] = []

    try {
        members = await getMembers()
    } catch (error) {
        console.error('Failed to fetch members:', error)
    }

    const { admins, leaders } = splitMembers(members as RoleAwareMember[])

    return (
        <div className="about-page min-h-screen pb-16">
            <div className="about-atmosphere" aria-hidden="true">
                <span className="about-blob about-blob-left" />
                <span className="about-blob about-blob-right" />
                <span className="about-blob about-blob-bottom" />
            </div>

            <AboutHero
                eyebrow="CÂU CHUYỆN CỦA CHÚNG TÔI"
                titleTop="ABOUT"
                titleBottom="DUT AI CLUB"
                description="Nơi những bộ óc sáng tạo gặp gỡ, cùng nhau khám phá và làm chủ sức mạnh của Trí tuệ nhân tạo."
            />

            <div className="relative mx-auto max-w-6xl space-y-12 px-5 sm:space-y-14 sm:px-6 md:px-12 lg:space-y-16">
                <AboutIntroCards />
                <AboutActivities />
                <AboutVisionMission />
                <AboutCoreValues />

                {admins.length > 0 && <AboutLeadership leaders={admins} />}

                {leaders.length > 0 && <AboutLeadersCarousel leaders={leaders} />}

                <section className="space-y-6">
                    <h2 className="about-section-title text-center">Thành viên</h2>
                    <Suspense fallback={<MembersGridSkeleton />}>
                        <MembersGrid />
                    </Suspense>
                </section>

                <Footer />
            </div>
        </div>
    )
}
