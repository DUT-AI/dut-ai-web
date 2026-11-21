export interface PublicEvent {
  id: number
  title: string
  description?: string
  summary?: string
  img_url?: string
  events_date?: string
  location?: string
  register_link?: string
  facebook_url?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export type PublicEventResponse = PublicEvent

export interface Post {
  id: number
  title: string
  description?: string
  summary?: string
  img_urls?: string[]
  hashtag?: string
  events_date?: string
  facebook_url?: string
  created_at: string
  updated_at: string
}

export type PostResponse = Post

export interface PastEvent {
  id: string
  type: 'public_event' | 'post'
  title: string
  summary?: string
  cover?: string
  date?: string
  facebook_url?: string
}
