import { eq, asc } from 'drizzle-orm'
import { db } from '../../index'
import { userCvs, userPortfolioProjects } from './schema'
import { projects, projectMembers } from '../projects/schema'
import { getManageUsers } from '@/lib/manage-users'
import { generateInitialUsername } from '@/lib/portfolio/username-generator'
import type {
  UserCv,
  MemberPortfolioData,
  UnifiedProject,
  UserPortfolioProjectModel,
  InsertUserPortfolioProject,
} from './types'

export async function getUserCvsMapQuery(): Promise<Map<number, string>> {
  try {
    const rows = await db.select().from(userCvs)
    const map = new Map<number, string>()
    for (const row of rows) {
      if (row.quote) {
        map.set(row.userId, row.quote)
      }
    }
    return map
  } catch (error) {
    console.error('Failed to load user CVs:', error)
    return new Map()
  }
}

export async function getUserCvsUsernameMapQuery(): Promise<Map<number, string>> {
  try {
    const rows = await db.select().from(userCvs)
    const map = new Map<number, string>()
    for (const row of rows) {
      if (row.username) {
        map.set(row.userId, row.username)
      }
    }
    return map
  } catch (error) {
    console.error('Failed to load user CV usernames:', error)
    return new Map()
  }
}

export async function getUserCvByUserIdQuery(userId: number): Promise<UserCv | null> {
  try {
    const row = await db.query.userCvs.findFirst({
      where: eq(userCvs.userId, userId),
    })
    if (!row) return null
    return {
      id: row.id,
      user_id: row.userId,
      username: row.username,
      quote: row.quote ?? undefined,
      headline: row.headline ?? undefined,
      bio: row.bio ?? undefined,
      avatar_url: row.avatarUrl ?? undefined,
      github_url: row.githubUrl ?? undefined,
      linkedin_url: row.linkedinUrl ?? undefined,
      facebook_url: row.facebookUrl ?? undefined,
      website_url: row.websiteUrl ?? undefined,
      skills: row.skills,
      cv_file_url: row.cvFileUrl ?? undefined,
      cv_file_name: row.cvFileName ?? undefined,
      cv_file_size: row.cvFileSize ?? undefined,
      is_public: row.isPublic,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    }
  } catch (error) {
    console.error(`Failed to load CV for user ${userId}:`, error)
    return null
  }
}

export async function upsertUserCvQuery(userId: number, quote: string): Promise<void> {
  const now = new Date()
  await db
    .insert(userCvs)
    .values({
      userId,
      quote,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userCvs.userId,
      set: {
        quote,
        updatedAt: now,
      },
    })
}

/**
 * Upserts a full portfolio profile for a member.
 */
export async function upsertMemberPortfolioQuery(
  userId: number,
  data: Partial<UserCv>
): Promise<void> {
  const now = new Date()
  await db
    .insert(userCvs)
    .values({
      userId,
      username: data.username,
      headline: data.headline,
      quote: data.quote,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      githubUrl: data.github_url,
      linkedinUrl: data.linkedin_url,
      facebookUrl: data.facebook_url,
      websiteUrl: data.website_url,
      skills: data.skills ?? [],
      cvFileUrl: data.cv_file_url,
      cvFileName: data.cv_file_name,
      cvFileSize: data.cv_file_size,
      isPublic: data.is_public ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userCvs.userId,
      set: {
        ...(data.username !== undefined ? { username: data.username } : {}),
        ...(data.headline !== undefined ? { headline: data.headline } : {}),
        ...(data.quote !== undefined ? { quote: data.quote } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.avatar_url !== undefined ? { avatarUrl: data.avatar_url } : {}),
        ...(data.github_url !== undefined ? { githubUrl: data.github_url } : {}),
        ...(data.linkedin_url !== undefined ? { linkedinUrl: data.linkedin_url } : {}),
        ...(data.facebook_url !== undefined ? { facebookUrl: data.facebook_url } : {}),
        ...(data.website_url !== undefined ? { websiteUrl: data.website_url } : {}),
        ...(data.skills !== undefined ? { skills: data.skills } : {}),
        ...(data.cv_file_url !== undefined ? { cvFileUrl: data.cv_file_url } : {}),
        ...(data.cv_file_name !== undefined ? { cvFileName: data.cv_file_name } : {}),
        ...(data.cv_file_size !== undefined ? { cvFileSize: data.cv_file_size } : {}),
        ...(data.is_public !== undefined ? { isPublic: data.is_public } : {}),
        updatedAt: now,
      },
    })
}

/**
 * Retrieves all personal projects created by a user.
 */
export async function getUserPortfolioProjectsQuery(
  userId: number
): Promise<UserPortfolioProjectModel[]> {
  return db
    .select()
    .from(userPortfolioProjects)
    .where(eq(userPortfolioProjects.userId, userId))
    .orderBy(asc(userPortfolioProjects.displayOrder), asc(userPortfolioProjects.createdAt))
}

export async function createPersonalProjectQuery(
  data: InsertUserPortfolioProject
): Promise<UserPortfolioProjectModel> {
  const [created] = await db.insert(userPortfolioProjects).values(data).returning()
  return created
}

export async function updatePersonalProjectQuery(
  id: number,
  userId: number,
  data: Partial<InsertUserPortfolioProject>
): Promise<UserPortfolioProjectModel | null> {
  const [updated] = await db
    .update(userPortfolioProjects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userPortfolioProjects.id, id))
    .returning()
  return updated ?? null
}

export async function deletePersonalProjectQuery(id: number, userId: number): Promise<boolean> {
  const deleted = await db
    .delete(userPortfolioProjects)
    .where(eq(userPortfolioProjects.id, id))
    .returning()
  return deleted.length > 0
}

/**
 * Retrieves club verified projects associated with an external user id.
 */
export async function getMemberClubProjectsQuery(userId: number): Promise<UnifiedProject[]> {
  try {
    const rows = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        imageUrl: projects.imageUrl,
        demoUrl: projects.demoUrl,
        technologies: projects.technologies,
        role: projectMembers.role,
      })
      .from(projectMembers)
      .innerJoin(projects, eq(projectMembers.projectId, projects.id))
      .where(eq(projectMembers.externalUserId, userId))

    // Gom nhóm theo project.id và tổng hợp các vai trò nếu thành viên đảm nhiệm nhiều vị trí
    const projectMap = new Map<number, UnifiedProject>()

    for (const r of rows) {
      const existing = projectMap.get(r.id)
      if (existing) {
        if (r.role && !existing.clubRole?.includes(r.role)) {
          existing.clubRole = existing.clubRole ? `${existing.clubRole}, ${r.role}` : r.role
        }
      } else {
        projectMap.set(r.id, {
          id: r.id,
          title: r.title,
          description: r.description,
          imageUrl: r.imageUrl,
          demoUrl: r.demoUrl,
          repoUrl: null,
          technologies: r.technologies,
          isClubProject: true,
          clubRole: r.role || null,
        })
      }
    }

    return Array.from(projectMap.values())
  } catch (error) {
    console.error(`Failed to get club projects for user ${userId}:`, error)
    return []
  }
}

/**
 * Fetches complete public member portfolio data by username handle.
 */
export async function getMemberPortfolioByUsername(
  username: string
): Promise<MemberPortfolioData | null> {
  try {
    const normalizedUsername = username.trim().toLowerCase()

    // 1. First, search in user_cv table
    let cvRecord = await db.query.userCvs.findFirst({
      where: eq(userCvs.username, normalizedUsername),
    })

    // 2. Fetch member catalog from SSO to resolve profile name, roles, and avatar
    const members = await getManageUsers()

    let targetMember = members.find((m) => cvRecord && m.id === cvRecord.userId)

    // Fallback: If no explicit cvRecord has this username, check if any member has this generated default slug
    if (!cvRecord || !targetMember) {
      const match = members.find((m) => {
        const defaultSlug = generateInitialUsername(m.name, m.email, m.id)
        return defaultSlug.toLowerCase() === normalizedUsername
      })

      if (match) {
        targetMember = match
        cvRecord = await db.query.userCvs.findFirst({
          where: eq(userCvs.userId, match.id),
        })

        // Auto-persist the initial username if not yet saved
        if (!cvRecord?.username) {
          await upsertMemberPortfolioQuery(match.id, {
            username: normalizedUsername,
            quote: match.quote,
          })
        }
      }
    }

    if (!targetMember) {
      return null
    }

    const userId = targetMember.id

    // 3. Query club projects and personal projects in parallel
    const [clubProjects, personalProjects] = await Promise.all([
      getMemberClubProjectsQuery(userId),
      getUserPortfolioProjectsQuery(userId),
    ])

    const formattedPersonalProjects: UnifiedProject[] = personalProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      demoUrl: p.demoUrl,
      repoUrl: p.repoUrl,
      technologies: p.technologies,
      isClubProject: false,
      clubRole: null,
      displayOrder: p.displayOrder,
    }))

    // Unified projects list: Club verified projects first, then personal projects
    const allProjects: UnifiedProject[] = [...clubProjects, ...formattedPersonalProjects]

    return {
      userId,
      name: targetMember.name,
      username: cvRecord?.username || normalizedUsername,
      avatarUrl: cvRecord?.avatarUrl || targetMember.avatar_url,
      headline: cvRecord?.headline || targetMember.role_name,
      quote: cvRecord?.quote || targetMember.quote,
      bio: cvRecord?.bio,
      clubRole: targetMember.role_name,
      socialLinks: {
        github: cvRecord?.githubUrl || targetMember.github,
        linkedin: cvRecord?.linkedinUrl || targetMember.linkedin,
        facebook: cvRecord?.facebookUrl,
        website: cvRecord?.websiteUrl,
      },
      skills: (cvRecord?.skills as any) || [],
      projects: allProjects,
      cv: cvRecord?.cvFileUrl
        ? {
            fileUrl: cvRecord.cvFileUrl,
            fileName: cvRecord.cvFileName,
            fileSize: cvRecord.cvFileSize,
            updatedAt: cvRecord.updatedAt,
          }
        : null,
      isPublic: cvRecord?.isPublic ?? true,
    }
  } catch (error) {
    console.error(`Error loading portfolio for username ${username}:`, error)
    return null
  }
}
