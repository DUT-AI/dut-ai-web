import { MetadataRoute } from 'next'
import { getBlogsCached as getBlogs } from '@/lib/db/cached-queries'
import type { Blog } from '@/lib/db/features/blogs/types'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '') // strip trailing slash

  // Static routes with priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/events`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Blog posts
  let blogs: Blog[] = []
  try {
    blogs = await getBlogs()
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error)
  }

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${siteUrl}/blog/${post.slug || post.id}`,
    lastModified: post.updated_at || post.created_at,
    changeFrequency: 'monthly' as const,
    priority: post.keywords?.some((k) => k.keyword_name.toLowerCase() === 'event') ? 0.85 : 0.8,
  }))

  return [...staticRoutes, ...blogRoutes]
}
