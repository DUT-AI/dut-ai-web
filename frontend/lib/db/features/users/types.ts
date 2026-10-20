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
}

export interface UserCv {
  id?: number
  user_id: number
  quote?: string
  created_at?: Date
  updated_at?: Date
}

export type MemberResponse = Member
