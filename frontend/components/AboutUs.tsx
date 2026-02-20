import { getIntroductions } from 'app/api-client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'

/**
 * AboutUs component — fetches content from FastAPI /introductions endpoint.
 * Falls back to local about_us.md if API is unavailable.
 */
export default async function AboutUs() {
    let content = ''

    try {
        const introductions = await getIntroductions()
        // Sort by order field if present, then concatenate content
        const sorted = [...introductions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        content = sorted.map((item) => {
            const heading = item.title && item.title !== 'undefined' ? `## ${item.title}\n\n` : ''
            return `${heading}${item.content}`
        }).join('\n\n---\n\n')
    } catch {
        // Fallback to local markdown file
        try {
            const filePath = path.join(process.cwd(), 'data', 'about_us.md')
            content = fs.readFileSync(filePath, 'utf8')
        } catch {
            content = 'DUT AI Club — Câu lạc bộ Trí tuệ Nhân tạo tại Đại học Bách khoa Đà Nẵng.'
        }
    }

    return (
        <article className="prose prose-slate dark:prose-invert max-w-none dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 dark:prose-strong:text-white dark:prose-a:text-primary-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </article>
    )
}