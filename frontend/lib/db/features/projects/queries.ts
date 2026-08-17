import { desc, eq } from 'drizzle-orm'
import { db } from '../../index'
import { projects, projectMembers } from './schema'
import { ProjectResponse, CreateProjectInput } from './types'

export async function getProjectsQuery(): Promise<ProjectResponse[]> {
  const result = await db.query.projects.findMany({
    orderBy: [desc(projects.id)],
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  })

  return result.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? '',
    image_url: p.imageUrl ?? undefined,
    features: p.features ?? undefined,
    technologies: p.technologies ?? undefined,
    demo_url: p.demoUrl ?? undefined,
    video_url: p.videoUrl ?? undefined,
    members: p.members.map((m) => ({
      id: m.id,
      user_id: m.userId,
      name: m.user?.name ?? 'Unknown',
      avatar_url: m.user?.avatarUrl ?? undefined,
      role: m.role,
    })),
  }))
}

export async function getProjectByIdQuery(id: number): Promise<ProjectResponse | null> {
  const p = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  })

  if (!p) return null

  return {
    id: p.id,
    title: p.title,
    description: p.description ?? '',
    image_url: p.imageUrl ?? undefined,
    features: p.features ?? undefined,
    technologies: p.technologies ?? undefined,
    demo_url: p.demoUrl ?? undefined,
    video_url: p.videoUrl ?? undefined,
    members: p.members.map((m) => ({
      id: m.id,
      user_id: m.userId,
      name: m.user?.name ?? 'Unknown',
      avatar_url: m.user?.avatarUrl ?? undefined,
      role: m.role,
    })),
  }
}

export async function createProjectQuery(input: CreateProjectInput): Promise<ProjectResponse> {
  const [newProject] = await db
    .insert(projects)
    .values({
      title: input.title,
      description: input.description ?? null,
      imageUrl: input.image_url ?? null,
      features: input.features ?? null,
      technologies: input.technologies ?? null,
      demoUrl: input.demo_url ?? null,
      videoUrl: input.video_url ?? null,
    })
    .returning()

  if (Array.isArray(input.members) && input.members.length > 0) {
    await db.insert(projectMembers).values(
      input.members.map((m) => ({
        projectId: newProject.id,
        userId: m.user_id,
        role: m.role || 'Member',
      }))
    )
  }

  const created = await getProjectByIdQuery(newProject.id)
  return created!
}

export async function updateProjectQuery(
  id: number,
  input: Partial<CreateProjectInput>
): Promise<ProjectResponse | null> {
  await db
    .update(projects)
    .set({
      title: input.title,
      description: input.description,
      imageUrl: input.image_url,
      features: input.features,
      technologies: input.technologies,
      demoUrl: input.demo_url,
      videoUrl: input.video_url,
    })
    .where(eq(projects.id, id))

  if (input.members !== undefined) {
    await db.delete(projectMembers).where(eq(projectMembers.projectId, id))
    if (input.members.length > 0) {
      await db.insert(projectMembers).values(
        input.members.map((m) => ({
          projectId: id,
          userId: m.user_id,
          role: m.role || 'Member',
        }))
      )
    }
  }

  return getProjectByIdQuery(id)
}

export async function deleteProjectQuery(id: number): Promise<boolean> {
  const result = await db.delete(projects).where(eq(projects.id, id)).returning()
  return result.length > 0
}
