import { BlogKeyword } from '../keywords/types'

export interface BlogAuthor {
  id: number
  name: string
  avatar_url?: string
}

export type BlogAuthorResponse = BlogAuthor

export interface Blog {
  id: number
  slug?: string
  title: string
  summary: string
  content?: string
  image_url?: string
  views: number
  authors: BlogAuthor[]
  keywords: BlogKeyword[]
  created_at: string
  updated_at: string
  related_blogs?: Blog[]
}

export type BlogResponse = Blog

export interface AuthorStats {
  id: number
  name: string
  avatar_url?: string
  total_views: number
  post_count: number
}

export type AuthorStatsResponse = AuthorStats
