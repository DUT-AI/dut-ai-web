import { Cpu, CheckCircle2 } from 'lucide-react'
import type { SkillCategory } from '@/features/users/db/types'

export interface PortfolioSkillsProps {
  skills: SkillCategory[]
}

export default function PortfolioSkills({ skills }: PortfolioSkillsProps) {
  if (!skills || skills.length === 0) {
    return null
  }

  return (
    <section id="skills" className="mt-12">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <Cpu className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Kỹ năng & Chuyên môn
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((category, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900/60"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.category}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.items.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                >
                  <CheckCircle2 className="h-3 w-3 text-blue-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
