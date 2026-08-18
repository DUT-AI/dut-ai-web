import { Suspense } from 'react'
import { getMembersCached as getMembers } from '@/lib/db/cached-queries'
import type { Member } from '@/lib/db/features/users/types'
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-center shadow-sm backdrop-blur-xl animate-pulse dark:border-white/10 dark:bg-slate-900/60">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-3 h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-1 h-2 w-10 rounded bg-slate-100 dark:bg-slate-800" />
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
        <div className="relative min-h-screen pb-16 bg-gradient-to-b from-[#f8faff] via-[#fff5f8] to-[#e6f0fa] dark:from-gray-950 dark:via-gray-900 dark:to-[#0f172a] overflow-hidden">
            {/* Global Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[5%] -left-[10%] w-[60%] h-[20%] rounded-full bg-blue-100/50 mix-blend-multiply filter blur-[120px] dark:bg-blue-900/10" />
                <div className="absolute top-[30%] right-[0%] w-[50%] h-[30%] rounded-full bg-pink-100/50 mix-blend-multiply filter blur-[120px] dark:bg-pink-900/10" />
                <div className="absolute bottom-[20%] -left-[5%] w-[40%] h-[40%] rounded-full bg-blue-200/30 mix-blend-multiply filter blur-[120px] dark:bg-blue-800/10" />
            </div>

            <div className="relative z-10">
                <AboutHero
                    eyebrow="CÂU CHUYỆN CỦA CHÚNG TÔI"
                    titleTop="ABOUT"
                    titleBottom="DUT AI CLUB"
                    description="Nơi những bộ óc sáng tạo gặp gỡ, cùng nhau khám phá và làm chủ sức mạnh của Trí tuệ Nhân tạo."
                />

                <div className="mx-auto max-w-6xl space-y-16 px-6 sm:px-8 md:px-12">
                    <AboutIntroCards />
                    <AboutActivities />
                    <AboutVisionMission />
                    <AboutCoreValues />

                    {admins.length > 0 && <AboutLeadership leaders={admins} />}

                    {leaders.length > 0 && <AboutLeadersCarousel leaders={leaders} />}

                    <section className="space-y-6">
                        <div className="text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                Những người tạo nên DUT AI
                            </p>
                            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                                Thành viên
                            </h2>
                        </div>
                        <Suspense fallback={<MembersGridSkeleton />}>
                            <MembersGrid />
                        </Suspense>
                    </section>

                    <Footer />
                </div>
            </div>
        </div>
    )
}
