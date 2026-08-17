import { asc, eq } from 'drizzle-orm'
import { db } from '../../index'
import { introductions } from './schema'
import { IntroductionResponse } from './types'

export async function getIntroductionsQuery(): Promise<IntroductionResponse[]> {
  const list = await db.select().from(introductions).orderBy(asc(introductions.id))
  return list.map((i) => ({
    id: i.id,
    title: `Section ${i.id}`,
    content: i.content,
    order: i.id,
  }))
}

export async function getIntroductionByIdQuery(id: number): Promise<IntroductionResponse | null> {
  const [intro] = await db.select().from(introductions).where(eq(introductions.id, id))
  if (!intro) return null
  return {
    id: intro.id,
    title: `Section ${intro.id}`,
    content: intro.content,
    order: intro.id,
  }
}

export async function updateIntroductionQuery(id: number, content: string): Promise<void> {
  await db
    .update(introductions)
    .set({
      content,
    })
    .where(eq(introductions.id, id))
}

export async function createIntroductionQuery(content: string): Promise<number> {
  const [created] = await db
    .insert(introductions)
    .values({
      content,
    })
    .returning({ id: introductions.id })
  return created.id
}
