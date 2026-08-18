import type { Member } from '@/lib/db/features/users/types'
import Image from 'next/image'

type RoleAwareMember = Member & {
    role_id?: number
}

type AboutLeadershipProps = {
    leaders: RoleAwareMember[]
}

function normalizeRoleName(roleName: string | undefined) {
    return (roleName ?? '').trim().toLowerCase()
}

function getLeadershipLabel(member: RoleAwareMember, index: number) {
    const roleName = normalizeRoleName(member.role_name)

    if (roleName.includes('chủ nhiệm') || roleName.includes('chu nhiem')) {
        if (roleName.includes('phó') || roleName.includes('pho') || roleName.includes('vice')) {
            return 'Phó Chủ nhiệm'
        }
        return 'Chủ nhiệm'
    }

    if (roleName.includes('phó') || roleName.includes('pho') || roleName.includes('vice')) {
        return 'Phó Chủ nhiệm'
    }

    if (member.role_id === 1) {
        return index === 0 ? 'Chủ nhiệm' : 'Ban Chủ nhiệm'
    }

    return 'Ban Chủ nhiệm'
}

export default function AboutLeadership({ leaders }: AboutLeadershipProps) {
    return (
        <section className="space-y-8 text-center">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Lãnh đạo câu lạc bộ
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    Ban Chủ nhiệm
                </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
                {leaders.map((member, index) => (
                    <article
                        key={member.id}
                        className="group flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
                    >
                        <div className="relative mb-5 h-28 w-28 overflow-hidden rounded-full border-4 border-white/80 shadow-lg dark:border-slate-800">
                            {member.avatar_url ? (
                                <Image
                                    src={member.avatar_url}
                                    alt={member.name}
                                    fill
                                    sizes="112px"
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white">
                                    {member.name.slice(0, 1)}
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                            {member.name}
                        </h3>
                        <span className="mt-2 rounded-full border border-blue-500/20 bg-blue-50/80 px-3.5 py-1 text-xs font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            {getLeadershipLabel(member, index)}
                        </span>
                    </article>
                ))}
            </div>
        </section>
    )
}
