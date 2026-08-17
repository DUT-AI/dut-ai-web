import { compileMDX } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import Image from '@/components/Image'
import TableWrapper from '@/components/TableWrapper'
import Pre from '@/components/Pre'
import { getBlogBySlugCached as getBlogBySlug, getBlogsCached as getBlogs } from '@/lib/db/cached-queries'
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
      slug: [String(post.id)],
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

  const { content } = await compileMDX({
    source: post.content,
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
    '@type': 'Bloging',
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteMetadata.siteUrl}/blog/${slug}` },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteMetadata.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteMetadata.siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteMetadata.siteUrl}/blog/${slug}` },
    ],
  }

  return (
    <PostLayoutAPI post={post}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <style dangerouslySetInnerHTML={{
        __html: `
          .prose :not(pre) > code::before, .prose :not(pre) > code::after { content: "" !important; }
          .prose :not(pre) > code { background-color: #f0f7ff; color: #1d4ed8; padding: 0.15em 0.4em; border-radius: 0.4rem; font-size: 0.9em; font-weight: 600; border: 1px solid #dbeafe; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03); white-space: nowrap; }
          .dark .prose :not(pre) > code { background-color: rgba(30,58,138,0.25); color: #60a5fa; border-color: rgba(30,58,138,0.5); box-shadow: none; }
          .prose h1, .prose h2, .prose h3, .prose h4 { scroll-margin-top: 120px; }
          .prose h2 code, .prose h3 code, .prose h4 code { background: transparent !important; border: none !important; color: inherit !important; font-size: inherit !important; padding: 0 !important; font-weight: inherit !important; }
          .subheading-anchor { opacity: 0; margin-left: 0.5rem; text-decoration: none !important; transition: all 0.2s; color: #3b82f6 !important; }
          .subheading-anchor::after { content: "#"; }
          h2:hover .subheading-anchor, h3:hover .subheading-anchor, h4:hover .subheading-anchor { opacity: 1; }
          .prose { max-width: none; }
          .prose aside { margin: 2.5rem 0; padding: 0.5rem 0.5rem 0.5rem 1rem; border-radius: 1.25rem; border-left: 5px solid #3b82f6; background-color: #f0f7ff; color: #1e40af; font-style: italic; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .dark .prose aside { background-color: rgba(30,58,138,0.25); border-color: #3b82f6; color: #dbeafe; box-shadow: none; }
          .prose pre { padding-right: 3rem !important; position: relative; }
        `
      }} />
      {content}
    </PostLayoutAPI>
  )
}
