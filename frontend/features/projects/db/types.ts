export interface ProjectMemberDetail {
  id: number
  user_id?: number
  name?: string
  user_name?: string
  avatar_url?: string | null
  user_avatar_url?: string | null
  role?: string
}

export type ProjectMember = ProjectMemberDetail

export interface Project {
  id: number
  title: string
  description: string
  slug?: string
  href?: string
  imgSrc?: string
  image_url?: string
  github_url?: string
  tags?: string[]
  features?: string | null
  technologies?: string | null
  demo_url?: string | null
  video_url?: string | null
  members?: ProjectMemberDetail[]
}

export type ProjectResponse = Project

export interface CreateProjectInput {
  title: string
  description?: string
  image_url?: string
  features?: string
  technologies?: string
  demo_url?: string
  video_url?: string
  members?: {
    user_id: number
    role: string
  }[]
}
