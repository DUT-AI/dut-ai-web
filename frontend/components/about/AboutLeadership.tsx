import type { Member } from 'app/api-client'
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
            return 'Phó chủ nhiệm'
        }
        return 'Chủ nhiệm'
    }

    if (roleName.includes('phó') || roleName.includes('pho') || roleName.includes('vice')) {
        return 'Phó chủ nhiệm'
    }

    if (member.role_id === 1) {
        return index === 0 ? 'Chủ nhiệm' : 'Ban chủ nhiệm'
    }

    return 'Ban chủ nhiệm'
}

export default function AboutLeadership({ leaders }: AboutLeadershipProps) {
    return (
        <section className="space-y-6 text-center sm:space-y-8">
            <h2 className="about-section-title">Ban chủ nhiệm</h2>
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
                {leaders.map((member, index) => (
                    <article key={member.id} className="about-leadership-card">
                        <div className="about-leadership-avatar-wrap">
                            {member.avatar_url ? (
                                <Image
                                    src={member.avatar_url}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="about-avatar-fallback">{member.name.slice(0, 1)}</div>
                            )}
                        </div>
                        <h3 className="about-leadership-name">{member.name}</h3>
                        <p className="about-leadership-role">{getLeadershipLabel(member, index)}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
