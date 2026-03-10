'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const { resolvedTheme } = useTheme()

  if (!siteMetadata.comments?.provider) {
    return null
  }

  const isDark = resolvedTheme === 'dark'
  const commentsConfig = {
    ...siteMetadata.comments,
    giscusConfig: {
      ...(siteMetadata.comments as { giscusConfig?: Record<string, unknown> }).giscusConfig,
      theme: isDark
        ? ((siteMetadata.comments as { giscusConfig?: Record<string, unknown> }).giscusConfig
          ?.darkTheme ?? 'dark_dimmed')
        : ((siteMetadata.comments as { giscusConfig?: Record<string, unknown> }).giscusConfig
          ?.theme ?? 'light'),
    },
  }

  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={commentsConfig} slug={slug} />
      ) : (
        <button
          onClick={() => setLoadComments(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-3 text-sm font-bold text-gray-900 dark:text-white shadow-sm hover:shadow-md hover:ring-primary-400 dark:hover:ring-primary-500 transition-all"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Tải bình luận
        </button>
      )}
    </>
  )
}
