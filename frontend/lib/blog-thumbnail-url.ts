export function getBlogThumbnailPath(slug: string | number) {
  return `/api/og/blog/${encodeURIComponent(String(slug))}`
}

export function getBlogThumbnailUrl(siteUrl: string, slug: string | number) {
  return new URL(getBlogThumbnailPath(slug), siteUrl).toString()
}
