import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AboutUs() {
    // 1. Đọc nội dung file about_us.md
    const filePath = path.join(process.cwd(), 'data', 'about_us.md')
    const content = fs.readFileSync(filePath, 'utf8')

    return (
        <section className="py-12">
            {/* 2. Dùng class 'prose' của Tailwind Typography để format Markdown cực đẹp */}
            <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </article>
        </section>
    )
}   