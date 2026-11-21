import type { Member } from 'app/api-client'
import Image from '@/components/common/Image'
import { glassClass } from './styles'

interface TeamPanelProps {
  members: Record<string, Member[]>
}

export default function TeamPanel({ members }: TeamPanelProps) {
  const getRowMembers = (roles: string[]) => {
    return roles.flatMap((role) => members[role] || [])
  }

  const row1 = getRowMembers(['Project Manager'])
  const row2 = getRowMembers(['Business Analyst', 'Designer'])
  const row3 = getRowMembers(['Frontend Developer', 'Backend Developer', 'AI Developer'])

  const knownRoles = new Set([
    'Project Manager',
    'Business Analyst',
    'Designer',
    'Frontend Developer',
    'Backend Developer',
    'AI Developer',
  ])
  const otherRoles = Object.keys(members).filter((role) => !knownRoles.has(role))
  const row4 = getRowMembers(otherRoles)

  const allRows = [row1, row2, row3, row4].filter((row) => row.length > 0)

  return (
    <div
      className={`${glassClass} flex h-[700px] flex-col rounded-[40px] px-8 py-8 sm:px-10 lg:h-[800px]`}
    >
      {/* Section heading */}
      <div className="mb-8 flex flex-shrink-0 items-center gap-4">
        <h2
          className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[42px] dark:text-white"
          style={{ lineHeight: '1.1em' }}
        >
          Thành viên dự án
        </h2>
      </div>

      {/* Members grid - scrollable area */}
      <div className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent min-h-0 flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-8 pb-4">
          {allRows.map((rowMembers, idx) => (
            <div key={idx} className="flex flex-wrap justify-start gap-4">
              {rowMembers.map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Member Card ── */
function MemberCard({ member }: { member: Member }) {
  return (
    <div
      className="relative aspect-[4/5] w-[110px] overflow-hidden rounded-3xl border border-indigo-200/30 bg-indigo-50/60 sm:w-[130px] lg:w-[140px] dark:border-white/10 dark:bg-white/5"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
    >
      {member.avatar_url ? (
        <Image
          alt={member.name}
          src={member.avatar_url}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
          <span className="text-4xl text-white/60">🤖</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div className="absolute right-0 bottom-0 left-0 flex flex-col items-start p-3 pb-4 text-left">
        <p className="text-[13px] leading-tight font-bold whitespace-normal text-white drop-shadow-md sm:text-[15px]">
          {member.name}
        </p>
        <p className="mt-1 text-[10px] text-white/80 drop-shadow-md sm:text-[11px]">
          {member.role_name || 'Member'}
        </p>
      </div>
    </div>
  )
}
