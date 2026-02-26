import type { Member } from 'app/api-client'
import Image from '@/components/Image'
import { jakarta } from './styles'

interface TeamPanelProps {
  members: Member[]
}

export default function TeamPanel({ members }: TeamPanelProps) {
  return (
    <div className="py-8">
      {/* Section heading */}
      <div className="mb-10 flex items-center gap-4">
        <h2
          className="text-3xl font-bold text-white sm:text-4xl lg:text-[42px]"
          style={{ ...jakarta, lineHeight: '1.1em' }}
        >
          Thành viên dự án
        </h2>
        {/* Lead member highlight */}
        {members[0] && (
          <div className="ml-2 h-12 w-12 overflow-hidden rounded-full border-2 border-orange-400 shadow-lg shadow-orange-500/30">
            {members[0].avatar_url ? (
              <Image
                alt={members[0].name}
                src={members[0].avatar_url}
                width={48}
                height={48}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-orange-700" />
            )}
          </div>
        )}
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-8">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  )
}

/* ── Member Card ── */
function MemberCard({ member }: { member: Member }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-3xl border border-white/10 bg-white/5"
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
      </div>
      <p className="text-center text-sm font-semibold text-white sm:text-base" style={jakarta}>
        {member.name}
      </p>
    </div>
  )
}
