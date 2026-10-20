'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookOpen, Layers3, UsersRound } from 'lucide-react'
import type {
  GenerationAlbum as GenerationAlbumData,
  GenerationMember,
} from '@/lib/db/features/organization/types'
import MemberDetailModal from './MemberDetailModal'

const memberCardTones = [
  'from-[#edf5ff] to-[#f1f8ff] dark:from-blue-950/35 dark:to-slate-950',
  'from-[#f4f2ff] to-[#fceefe] dark:from-violet-950/35 dark:to-slate-950',
  'from-[#edfce9] to-[#fefbe8] dark:from-emerald-950/35 dark:to-slate-950',
  'from-[#fff5f5] to-[#fff0ed] dark:from-orange-950/35 dark:to-slate-950',
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function GenerationAlbum({ albums }: { albums: GenerationAlbumData[] }) {
  const [selectedGenerationId, setSelectedGenerationId] = useState(() => albums[0]?.id ?? 0)
  const [selectedDepartmentByGen, setSelectedDepartmentByGen] = useState<Record<number, number>>({})
  const [selectedMember, setSelectedMember] = useState<{
    member: GenerationMember
    departmentName: string
    generationName?: string
    accentColor: string
  } | null>(null)

  if (!albums || albums.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Album đang được chuẩn bị
        </h2>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          Các thế hệ DUT AI sẽ sớm xuất hiện tại đây.
        </p>
      </section>
    )
  }

  const activeGeneration = albums.find((item) => item.id === selectedGenerationId) ?? albums[0]

  return (
    <section id="members" className="scroll-mt-24 space-y-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.24em] text-blue-600 uppercase dark:text-blue-400">
          Những người tạo nên DUT AI
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          Album các thế hệ
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          Mỗi thế hệ là một chương riêng, với những con người và cách tổ chức mang dấu ấn của mình.
        </p>
      </div>

      <div className="mx-auto flex max-w-5xl justify-center">
        <div
          className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/75 p-1.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75"
          role="tablist"
          aria-label="Chọn thế hệ"
        >
          <span className="hidden shrink-0 px-3 text-xs font-black tracking-[0.18em] text-slate-400 uppercase sm:inline">
            Thế hệ
          </span>
          {albums.map((album) => {
            const selected = album.id === activeGeneration.id
            return (
              <button
                key={album.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedGenerationId(album.id)}
                className={`group flex min-w-max items-center gap-2 rounded-xl px-3.5 py-2 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none sm:px-4 ${
                  selected
                    ? 'bg-slate-950 text-white shadow-md dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/30"
                  style={{ backgroundColor: album.accent_color || '#2563eb' }}
                />
                <span>
                  <span className="block text-sm font-extrabold">{album.name}</span>
                  {album.period && (
                    <span className="block text-[11px] opacity-65">{album.period}</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid container holding all albums stacked to preserve uniform max-height */}
      <div className="grid overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-950">
        {albums.map((generation) => {
          const isGenSelected = generation.id === activeGeneration.id
          const selectedDeptId =
            selectedDepartmentByGen[generation.id] ?? generation.departments[0]?.id
          const currentDept =
            generation.departments.find((d) => d.id === selectedDeptId) ??
            generation.departments[0]
          const memberCount = generation.departments.reduce(
            (sum, item) => sum + item.members.length,
            0
          )
          const accent = generation.accent_color || '#2563eb'

          return (
            <div
              key={generation.id}
              role="tabpanel"
              aria-hidden={!isGenSelected}
              className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-200 ${
                isGenSelected
                  ? 'relative z-10 opacity-100'
                  : 'pointer-events-none invisible relative -z-10 opacity-0'
              }`}
            >
              {/* Cover Header */}
              <div
                className="relative isolate overflow-hidden px-6 py-8 text-white sm:px-10 sm:py-10 lg:px-12"
                style={{ backgroundColor: accent }}
              >
                <div
                  className="absolute inset-0 -z-20"
                  style={{
                    background:
                      'radial-gradient(circle at 8% 0%, rgba(255,255,255,.28), transparent 34%), radial-gradient(circle at 92% 100%, rgba(15,23,42,.35), transparent 42%), linear-gradient(125deg, rgba(15,23,42,.04), rgba(15,23,42,.45))',
                  }}
                />
                {generation.cover_image_url && (
                  <Image
                    src={generation.cover_image_url}
                    alt=""
                    fill
                    sizes="100vw"
                    className="-z-30 object-cover opacity-25 mix-blend-luminosity"
                    unoptimized
                  />
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur sm:text-sm">
                    DUT AI CLUB · ARCHIVE
                  </span>
                  <BookOpen className="h-6 w-6 opacity-80" />
                </div>

                <div className="mt-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    {generation.period && (
                      <p className="text-sm font-bold tracking-[0.25em] text-white/70 uppercase">
                        {generation.period}
                      </p>
                    )}
                    <h3 className="mt-3 text-5xl leading-none font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                      {generation.name}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                      {generation.description ||
                        'Một chương trong hành trình học hỏi, sáng tạo và trưởng thành cùng DUT AI.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-32 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                      <UsersRound className="h-5 w-5 text-white/75" />
                      <strong className="mt-3 block text-2xl font-black">{memberCount}</strong>
                      <span className="text-xs font-semibold text-white/65">Thành viên</span>
                    </div>
                    <div className="min-w-32 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                      <Layers3 className="h-5 w-5 text-white/75" />
                      <strong className="mt-3 block text-2xl font-black">
                        {generation.departments.length}
                      </strong>
                      <span className="text-xs font-semibold text-white/65">Phòng ban</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Tabs */}
              <div className="border-b border-slate-200/80 bg-white/90 px-5 pt-5 sm:px-8 sm:pt-7 dark:border-white/10 dark:bg-slate-950/90">
                <div className="mb-4">
                  <p className="text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
                    Khám phá đội ngũ
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                    Chọn phòng ban
                  </h3>
                </div>

                <div
                  className="flex gap-2 overflow-x-auto pb-5"
                  role="tablist"
                  aria-label={`Phòng ban ${generation.name}`}
                >
                  {generation.departments.map((item, index) => {
                    const selected = item.id === currentDept?.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={`department-panel-${item.id}`}
                        onClick={() =>
                          setSelectedDepartmentByGen((prev) => ({
                            ...prev,
                            [generation.id]: item.id,
                          }))
                        }
                        className={`flex min-w-max items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                          selected
                            ? 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-900/10 dark:border-white dark:bg-white dark:text-slate-950'
                            : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white'
                        }`}
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white"
                          style={{ backgroundColor: item.accent_color || accent }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold">{item.name}</span>
                          <span className="block text-xs opacity-60">
                            {item.members.length} thành viên
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Department Panels Stack */}
              <div className="grid overflow-hidden bg-gradient-to-b from-white to-slate-50/70 dark:from-slate-950 dark:to-slate-950">
                {generation.departments.length === 0 ? (
                  <div className="col-start-1 row-start-1 flex min-h-72 flex-col items-center justify-center p-8 text-center">
                    <UsersRound className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <p className="mt-4 text-base font-semibold text-slate-500">
                      Chưa có phòng ban trong thế hệ này.
                    </p>
                  </div>
                ) : (
                  generation.departments.map((dept) => {
                    const isCurrent = dept.id === currentDept?.id
                    return (
                      <div
                        key={dept.id}
                        id={`department-panel-${dept.id}`}
                        role="tabpanel"
                        aria-hidden={!isCurrent}
                        className={`col-start-1 row-start-1 p-5 transition-opacity duration-200 sm:p-8 lg:p-10 ${
                          isCurrent
                            ? 'relative z-10 opacity-100'
                            : 'pointer-events-none invisible relative -z-10 opacity-0'
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p
                              className="text-sm font-bold tracking-[0.2em] uppercase"
                              style={{ color: dept.accent_color || accent }}
                            >
                              {generation.name}
                            </p>
                            <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                              {dept.name}
                            </h3>
                            {dept.description && (
                              <p className="mt-2 max-w-2xl text-base leading-6 text-slate-500 dark:text-slate-400">
                                {dept.description}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            {dept.members.length} gương mặt
                          </span>
                        </div>

                        {dept.members.length === 0 ? (
                          <div className="flex min-h-72 flex-col items-center justify-center text-center">
                            <UsersRound className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                            <p className="mt-4 text-base font-semibold text-slate-500">
                              Chưa có thành viên trong phòng ban này.
                            </p>
                          </div>
                        ) : (
                          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                            {dept.members.map((member, index) => {
                              const inactive = member.status !== 'active'
                              return (
                                <article
                                  key={`${dept.id}-${member.id}`}
                                  onClick={() =>
                                    setSelectedMember({
                                      member,
                                      departmentName: dept.name,
                                      generationName: generation.name,
                                      accentColor: dept.accent_color || accent,
                                    })
                                  }
                                  className={`group cursor-pointer min-w-0 rounded-[2rem] bg-gradient-to-br p-3 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-white/10 ${
                                    memberCardTones[index % memberCardTones.length]
                                  }`}
                                >
                                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-white/65 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-white/10">
                                    {member.avatar_url ? (
                                      <Image
                                        src={member.avatar_url}
                                        alt={member.name}
                                        fill
                                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                                        className={`object-cover transition duration-500 group-hover:scale-105 ${
                                          inactive ? 'grayscale-[55%]' : ''
                                        }`}
                                        unoptimized
                                      />
                                    ) : (
                                      <div
                                        className="flex h-full items-center justify-center text-3xl font-black text-white"
                                        style={{
                                          background: `linear-gradient(145deg, ${
                                            dept.accent_color || accent
                                          }, #0f172a)`,
                                        }}
                                      >
                                        {initials(member.name)}
                                      </div>
                                    )}
                                    <span className="absolute top-3 left-3 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {inactive && (
                                      <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-slate-950/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                                        Cựu thành viên
                                      </span>
                                    )}
                                  </div>
                                  <div className="px-2 pt-4 pb-2">
                                    <h4 className="line-clamp-2 text-base leading-5 font-extrabold text-slate-950 dark:text-white">
                                      {member.name}
                                    </h4>
                                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                                      {member.title}
                                    </p>
                                  </div>
                                </article>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember?.member ?? null}
        departmentName={selectedMember?.departmentName}
        generationName={selectedMember?.generationName}
        accentColor={selectedMember?.accentColor}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  )
}
