export interface Member {
  id: number
  name: string
  role_name: string
  avatar_url?: string
  email?: string
  phone_number?: string
  status?: string
  role_id?: number
  discord_id?: string
  github?: string
  linkedin?: string
}

export type MemberResponse = Member
