import type { Member } from '../users/types'

export interface GenerationMember extends Member {
  title: string
  display_order: number
  is_featured: boolean
}

export interface GenerationDepartment {
  id: number
  name: string
  description?: string
  accent_color: string
  display_order: number
  members: GenerationMember[]
}

export interface GenerationAlbum {
  id: number
  name: string
  slug: string
  period?: string
  description?: string
  cover_image_url?: string
  accent_color: string
  display_order: number
  is_published: boolean
  departments: GenerationDepartment[]
}

export interface SaveGenerationInput {
  name: string
  slug: string
  period?: string
  description?: string
  cover_image_url?: string
  accent_color?: string
  display_order?: number
  is_published?: boolean
  departments: Array<{
    name: string
    description?: string
    accent_color?: string
    display_order?: number
    members: Array<{
      external_user_id: number
      title?: string
      display_order?: number
      is_featured?: boolean
    }>
  }>
}
