import type { Member } from 'app/api-client'
import Image from '@/components/Image'
import { jakarta, glass } from './styles'

interface TeamPanelProps {
  members: Record<string, Member[]>
}

export default function TeamPanel({ members }: TeamPanelProps) {
  const getRowMembers = (roles: string[]) => {
    return roles.flatMap(role => members[role] || [])
  }

  const row1 = getRowMembers(['Project Manager'])
  const row2 = getRowMembers(['Business Analyst', 'Designer'])
  const row3 = getRowMembers(['Frontend Developer', 'Backend Developer', 'AI Developer'])

  const knownRoles = new Set(['Project Manager', 'Business Analyst', 'Designer', 'Frontend Developer', 'Backend Developer', 'AI Developer'])
  const otherRoles = Object.keys(members).filter(role => !knownRoles.has(role))
  const row4 = getRowMembers(otherRoles)

  const allRows = [row1, row2, row3, row4].filter(row => row.length > 0)

  return (
    <div className="py-8 px-8 sm:px-10 rounded-[40px] h-[700px] lg:h-[800px] flex flex-col" style={glass}>
      {/* Section heading */}
      <div className="mb-8 flex items-center gap-4 flex-shrink-0">
        <h2
          className="text-3xl font-bold text-white sm:text-4xl lg:text-[42px]"
          style={{ ...jakarta, lineHeight: '1.1em' }}
        >
          Thành viên dự án
        </h2>
      </div>

      {/* Members grid - scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
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
      className="relative aspect-[4/5] w-[110px] sm:w-[130px] lg:w-[140px] overflow-hidden rounded-3xl border border-white/10 bg-white/5"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
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

      {/* Gradient overlay to make text highly legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 text-left flex flex-col items-start">
        <p className="text-[13px] sm:text-[15px] font-bold text-white leading-tight drop-shadow-md whitespace-normal" style={jakarta}>
          {member.name}
        </p>
        <p className="text-[10px] sm:text-[11px] text-white/80 mt-1 drop-shadow-md" style={jakarta}>
          {member.role_name || 'Member'}
        </p>
      </div>
    </div>
  )
}
