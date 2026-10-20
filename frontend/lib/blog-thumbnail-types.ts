export interface BlogAuthorInfo {
  name: string
  avatarUrl?: string | null
}

export interface BlogThumbnailOptions {
  title: string
  authors?: Array<BlogAuthorInfo | string>
  siteName?: string
  siteDomain?: string
  category?: string
}

export const BLOG_THUMBNAIL_SIZE = {
  width: 1200,
  height: 630,
} as const
