import type {
  SkillCategory,
  UserCvModel,
  InsertUserCv,
  UserPortfolioProjectModel,
  InsertUserPortfolioProject,
} from './schema'

export type {
  SkillCategory,
  UserCvModel,
  InsertUserCv,
  UserPortfolioProjectModel,
  InsertUserPortfolioProject,
}

export interface Member {
  id: number
  name: string
  role_name: string
  role_names?: string[]
  role_ids?: number[]
  avatar_url?: string
  email?: string
  phone_number?: string
  status?: string
  role_id?: number
  discord_id?: string
  github?: string
  linkedin?: string
  quote?: string
  username?: string
}

export interface UserCv {
  id?: number
  user_id: number
  username?: string | null
  quote?: string | null
  headline?: string | null
  bio?: string | null
  avatar_url?: string | null
  github_url?: string | null
  linkedin_url?: string | null
  facebook_url?: string | null
  website_url?: string | null
  skills?: SkillCategory[] | null
  cv_file_url?: string | null
  cv_file_name?: string | null
  cv_file_size?: number | null
  is_public?: boolean
  created_at?: Date
  updated_at?: Date
}

export interface UnifiedProject {
  id: number
  title: string
  description?: string | null
  imageUrl?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
  technologies?: string | null
  isClubProject: boolean
  clubRole?: string | null
  displayOrder?: number
}

export interface MemberPortfolioData {
  userId: number
  name: string
  username: string
  avatarUrl?: string | null
  headline?: string | null
  quote?: string | null
  bio?: string | null
  clubRole?: string | null
  socialLinks: {
    github?: string | null
    linkedin?: string | null
    facebook?: string | null
    website?: string | null
  }
  skills: SkillCategory[]
  projects: UnifiedProject[]
  cv?: {
    fileUrl: string
    fileName?: string | null
    fileSize?: number | null
    updatedAt?: Date | null
  } | null
  isPublic: boolean
}

export type MemberResponse = Member
