import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { BASE_KEYWORDS } from 'app/seo'
import { getBlogById } from 'app/api-client'
import PostAPILayout from '@/layouts/PostAPILayout'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const id = Number(params.slug[0])
  if (isNaN(id)) return undefined

  let post
  try {
    post = await getBlogById(id)
  } catch {
    return undefined
  }

  const publishedAt = new Date(post.created_at).toISOString()
  const tags = post.keywords?.map((kw) => kw.keyword_name) ?? []
  const ogImages = post.image_url
    ? [{ url: post.image_url }]
    : [{ url: siteMetadata.socialBanner }]
  const description = post.content?.replace(/<[^>]+>/g, '').slice(0, 200) ?? post.title

  return {
    title: post.title,
    description,
    keywords: [...BASE_KEYWORDS, ...tags],
    openGraph: {
      title: post.title,
      description,
      siteName: siteMetadata.title,
      locale: 'vi_VN',
      type: 'article',
      publishedTime: publishedAt,
      url: './',
      images: ogImages,
      authors: post.authors
        ? Array.isArray(post.authors) ? post.authors : [post.authors]
        : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.image_url ? [post.image_url] : [siteMetadata.socialBanner],
    },
  }
}

export default async function BlogPost(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const id = Number(params.slug[0])
  if (isNaN(id)) return notFound()

  let post
  try {
    post = await getBlogById(id)
  } catch {
    return notFound()
  }

  return <PostAPILayout content={post} />
}
