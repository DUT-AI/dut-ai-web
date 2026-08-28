import { compileMDX } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import Image from '@/components/Image'
import TableWrapper from '@/components/TableWrapper'
import Pre from '@/components/Pre'
import { getBlogBySlugCached as getBlogBySlug, getBlogsCached as getBlogs } from '@/lib/db/cached-queries'
import { fetchLessonBySlugFromQuiz } from '@/lib/quiz-client'
import PostLayoutAPI from '@/layouts/PostLayoutAPI'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import siteMetadata from '@/data/siteMetadata'
import 'katex/dist/katex.min.css'

const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
}

const mdxComponents = {
  Image,
  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith('http')
    return (
      <Link
        href={href || '#'}
        className="text-primary-500 font-medium no-underline hover:underline"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </Link>
    )
  },
  table: TableWrapper,
  pre: Pre,
}

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogs()
    return posts.map((post) => ({
      slug: [post.slug || String(post.id)],
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: slugParts } = await params
  const slug = slugParts?.join('/') || ''
  try {
    const post = await getBlogBySlug(slug)
    if (!post) {
      return { title: 'Bài viết không tồn tại' }
    }
    const authorNames = post.authors?.map((a: any) => a.name)
    const keywordList = post.keywords?.map((kw: any) => kw.keyword_name)
    return {
      title: post.title,
      description: post.summary,
      alternates: { canonical: `${siteMetadata.siteUrl}/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.summary,
        type: 'article',
        url: `${siteMetadata.siteUrl}/blog/${slug}`,
        publishedTime: post.created_at,
        modifiedTime: post.updated_at || post.created_at,
        authors: authorNames,
        images: post.image_url ? [post.image_url] : [siteMetadata.socialBanner],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.summary,
        images: post.image_url ? [post.image_url] : [siteMetadata.socialBanner],
      },
      keywords: keywordList,
      authors: authorNames?.map((name: string) => ({ name })),
    }
  } catch {
    return { title: 'Bài viết không tồn tại' }
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug: slugParts } = await params
  const slug = slugParts?.join('/') || ''

  let post
  try {
    post = await getBlogBySlug(slug)
  } catch {
    notFound()
  }

  if (!post) notFound()

  // Fetch live content from Quiz API
  let markdownSource = ''
  if (post.slug) {
    const quizLesson = await fetchLessonBySlugFromQuiz(post.slug)
    if (quizLesson?.content_md) {
      markdownSource = quizLesson.content_md
    }
  }

  const { content } = await compileMDX({
    source: markdownSource || '*Nội dung bài viết đang được cập nhật...*',
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings],
          rehypeKatex,
          [rehypePrettyCode as any, prettyCodeOptions],
        ],
      },
    },
    components: mdxComponents,
  })

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.image_url || siteMetadata.socialBanner,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: post.authors?.map((a: any) => ({
      '@type': 'Person',
      name: a.name,
      url: `${siteMetadata.siteUrl}/about`,
    })),
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      logo: { '@type': 'ImageObject', url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}` },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <PostLayoutAPI post={post}>{content}</PostLayoutAPI>
    </>
  )
}
