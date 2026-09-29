import { asc, eq } from 'drizzle-orm'
import { db } from '../../index'
import { getManageUsersMap } from '@/lib/manage-users'
import { getUserCvsMapQuery } from '../users/queries'
import { userCvs } from '../users/schema'
import { generationDepartments, generationMembers, generations } from './schema'
import type { GenerationAlbum, SaveGenerationInput } from './types'

function toAlbum(
  generation: any,
  users: Awaited<ReturnType<typeof getManageUsersMap>>,
  userCvsMap: Map<number, string>
): GenerationAlbum {
  return {
    id: generation.id,
    name: generation.name,
    slug: generation.slug,
    period: generation.period ?? undefined,
    description: generation.description ?? undefined,
    cover_image_url: generation.coverImageUrl ?? undefined,
    accent_color: generation.accentColor,
    display_order: generation.displayOrder,
    is_published: generation.isPublished,
    departments: generation.departments.map((department: any) => ({
      id: department.id,
      name: department.name,
      description: department.description ?? undefined,
      accent_color: department.accentColor,
      display_order: department.displayOrder,
      members: department.members.map((assignment: any) => {
        const user = users.get(assignment.externalUserId)
        const quote = userCvsMap.get(assignment.externalUserId)
        return {
          id: assignment.externalUserId,
          name: user?.name ?? 'Thành viên chưa đồng bộ',
          role_name: user?.role_name ?? 'teammate',
          role_names: user?.role_names,
          avatar_url: user?.avatar_url,
          status: user?.status ?? 'inactive',
          title: assignment.title,
          display_order: assignment.displayOrder,
          is_featured: assignment.isFeatured,
          quote: quote || user?.quote || undefined,
        }
      }),
    })),
  }
}

async function loadGenerations(publishedOnly: boolean) {
  return db.query.generations.findMany({
    where: publishedOnly ? eq(generations.isPublished, true) : undefined,
    orderBy: [asc(generations.displayOrder), asc(generations.id)],
    with: {
      departments: {
        orderBy: [asc(generationDepartments.displayOrder), asc(generationDepartments.id)],
        with: {
          members: {
            orderBy: [asc(generationMembers.displayOrder), asc(generationMembers.externalUserId)],
          },
        },
      },
    },
  })
}

export async function getGenerationAlbumsQuery(options: { publishedOnly?: boolean } = {}) {
  const [rows, users, userCvsMap] = await Promise.all([
    loadGenerations(options.publishedOnly ?? true),
    getManageUsersMap(),
    getUserCvsMapQuery(),
  ])
  return rows.map((row) => toAlbum(row, users, userCvsMap))
}

export async function getGenerationAlbumByIdQuery(id: number): Promise<GenerationAlbum | null> {
  const [row, users, userCvsMap] = await Promise.all([
    db.query.generations.findFirst({
      where: eq(generations.id, id),
      with: {
        departments: {
          orderBy: [asc(generationDepartments.displayOrder), asc(generationDepartments.id)],
          with: {
            members: {
              orderBy: [asc(generationMembers.displayOrder), asc(generationMembers.externalUserId)],
            },
          },
        },
      },
    }),
    getManageUsersMap(),
    getUserCvsMapQuery(),
  ])

  return row ? toAlbum(row, users, userCvsMap) : null
}

async function replaceDepartments(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  generationId: number,
  input: SaveGenerationInput
) {
  await tx.delete(generationDepartments).where(eq(generationDepartments.generationId, generationId))

  for (const [departmentIndex, department] of input.departments.entries()) {
    const [createdDepartment] = await tx
      .insert(generationDepartments)
      .values({
        generationId,
        name: department.name.trim(),
        description: department.description?.trim() || null,
        accentColor: department.accent_color || input.accent_color || '#2563eb',
        displayOrder: department.display_order ?? departmentIndex,
      })
      .returning({ id: generationDepartments.id })

    const uniqueMembers = Array.from(
      new Map(department.members.map((member) => [member.external_user_id, member])).values()
    ).filter((member) => Number.isFinite(member.external_user_id))

    if (uniqueMembers.length > 0) {
      await tx.insert(generationMembers).values(
        uniqueMembers.map((member, memberIndex) => ({
          generationId,
          departmentId: createdDepartment.id,
          externalUserId: member.external_user_id,
          title: member.title?.trim() || 'Thành viên',
          displayOrder: member.display_order ?? memberIndex,
          isFeatured: member.is_featured ?? false,
        }))
      )

      for (const member of uniqueMembers) {
        if (typeof member.quote === 'string' && member.quote.trim()) {
          const now = new Date()
          await tx
            .insert(userCvs)
            .values({
              userId: member.external_user_id,
              quote: member.quote.trim(),
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoUpdate({
              target: userCvs.userId,
              set: {
                quote: member.quote.trim(),
                updatedAt: now,
              },
            })
        }
      }
    }
  }
}

export async function createGenerationQuery(input: SaveGenerationInput): Promise<number> {
  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(generations)
      .values({
        name: input.name.trim(),
        slug: input.slug.trim(),
        period: input.period?.trim() || null,
        description: input.description?.trim() || null,
        coverImageUrl: input.cover_image_url?.trim() || null,
        accentColor: input.accent_color || '#2563eb',
        displayOrder: input.display_order ?? 0,
        isPublished: input.is_published ?? false,
      })
      .returning({ id: generations.id })

    await replaceDepartments(tx, created.id, input)
    return created.id
  })
}

export async function updateGenerationQuery(id: number, input: SaveGenerationInput) {
  await db.transaction(async (tx) => {
    await tx
      .update(generations)
      .set({
        name: input.name.trim(),
        slug: input.slug.trim(),
        period: input.period?.trim() || null,
        description: input.description?.trim() || null,
        coverImageUrl: input.cover_image_url?.trim() || null,
        accentColor: input.accent_color || '#2563eb',
        displayOrder: input.display_order ?? 0,
        isPublished: input.is_published ?? false,
        updatedAt: new Date(),
      })
      .where(eq(generations.id, id))

    await replaceDepartments(tx, id, input)
  })
}

export async function deleteGenerationQuery(id: number) {
  await db.delete(generations).where(eq(generations.id, id))
}
