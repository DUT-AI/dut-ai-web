import { User, Quote, Award } from 'lucide-react'

export interface PortfolioAboutProps {
  bio?: string | null
  quote?: string | null
  clubRole?: string | null
}

export default function PortfolioAbout({ bio, quote, clubRole }: PortfolioAboutProps) {
  if (!bio && !quote) {
    return null
  }

  return (
    <section id="about" className="mt-12">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <User className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Giới thiệu bản thân
        </h2>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        {clubRole && (
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <Award className="h-4 w-4" />
            <span>Vai trò: {clubRole} tại Câu lạc bộ DUT AI</span>
          </div>
        )}

        {bio && (
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed whitespace-pre-line">{bio}</p>
          </div>
        )}

        {quote && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <Quote className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <p className="text-gray-600 italic dark:text-gray-300">&ldquo;{quote}&rdquo;</p>
          </div>
        )}
      </div>
    </section>
  )
}
