import { compileMDX } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import Image from '@/components/Image'
import TableWrapper from '@/components/TableWrapper'
import Pre from '@/components/Pre'
import { getBlogBySlug, getBlogs } from 'app/api-client'
import PostLayoutAPI from '@/layouts/PostLayoutAPI'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import siteMetadata from '@/data/siteMetadata'
import 'katex/dist/katex.min.css'

// Options for Shiki syntax highlighting
const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
}

// Custom components for MDX
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
      slug: post.slug?.split('/') || [post.id.toString()],
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: slugParts } = await params
  const slug = slugParts?.join('/') || ''
  try {
    const post = await getBlogBySlug(slug)
    const authorNames = post.authors?.map((author: any) => author.name)
    const keywordList = post.keywords?.map((kw: any) => kw.keyword_name)

    return {
      title: post.title,
      description: post.summary,
      alternates: {
        canonical: `${siteMetadata.siteUrl}/blog/${slug}`,
      },
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
        site: siteMetadata.x,
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
  } catch (error) {
    notFound()
  }

  if (!post) {
    notFound()
  }

  // Compile MDX on the server
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

  // JSON-LD for Search Engines
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
      url: `${siteMetadata.siteUrl}/about`, // Fallback for author bio
    })),
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/blog/${slug}`,
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: siteMetadata.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteMetadata.siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteMetadata.siteUrl}/blog/${slug}`,
      },
    ],
  }

  return (
    <PostLayoutAPI post={post}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
                /* --- Remove backticks added by Tailwind Typography --- */
                .prose :not(pre) > code::before,
                .prose :not(pre) > code::after {
                    content: "" !important;
                }

                /* --- Premium Inline Code Style --- */
                .prose :not(pre) > code {
                    background-color: #f0f7ff; /* blue-50ish */
                    color: #1d4ed8; /* blue-700 */
                    padding: 0.15em 0.4em;
                    border-radius: 0.4rem;
                    font-size: 0.9em;
                    font-weight: 600;
                    font-family: var(--font-mono);
                    border: 1px solid #dbeafe; /* blue-100 */
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
                    white-space: nowrap;
                }
                .dark .prose :not(pre) > code {
                    background-color: rgba(30, 58, 138, 0.25); /* blue-900/25 */
                    color: #60a5fa; /* blue-400 */
                    border-color: rgba(30, 58, 138, 0.5);
                    box-shadow: none;
                }

                /* --- Heading Optimizations --- */
                .prose h1, .prose h2, .prose h3, .prose h4 {
                    scroll-margin-top: 120px;
                }

                .prose h2 code, .prose h3 code, .prose h4 code {
                    background: transparent !important;
                    border: none !important;
                    color: inherit !important;
                    font-size: inherit !important;
                    padding: 0 !important;
                    font-weight: inherit !important;
                }

                /* --- Heading Anchors (similar to Contentlayer) --- */
                .subheading-anchor {
                    opacity: 0;
                    margin-left: 0.5rem;
                    text-decoration: none !important;
                    transition: all 0.2s;
                    color: #3b82f6 !important;
                }
                .subheading-anchor::after {
                    content: "#";
                }
                h2:hover .subheading-anchor,
                h3:hover .subheading-anchor,
                h4:hover .subheading-anchor {
                    opacity: 1;
                }

                /* --- Article Layout Improvements --- */
                .prose {
                    max-width: none;
                }

                /* --- Premium Aside/Callout Style --- */
                .prose aside {
                    margin: 2.5rem 0;
                    padding: 0.5rem 0.5rem 0.5rem 1rem;
                    border-radius: 1.25rem;
                    border-left: 5px solid #3b82f6;
                    background-color: #f0f7ff;
                    position: relative;
                    color: #1e40af;
                    font-style: italic;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }

                .dark .prose aside {
                    background-color: rgba(30, 58, 138, 0.25);
                    border-color: #3b82f6;
                    color: #dbeafe;
                    box-shadow: none;
                }

                /* --- Code Block Overrides --- */
                .prose pre {
                    padding-right: 3rem !important; /* Make room for the copy button */
                    position: relative;
                }
            `}} />
      {content}
    </PostLayoutAPI>
  )
}
