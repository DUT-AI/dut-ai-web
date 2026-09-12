import dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config({ path: '../.env' })

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB}`

const sql = postgres(databaseUrl, { connect_timeout: 5 })

try {
  const localUsers = await sql`select id from users order by id`
  const projectRefs = await sql`select distinct user_id as id from project_members order by user_id`
  const blogRefs = await sql`select distinct user_id as id from blog_authors order by user_id`
  const response = await fetch(
    process.env.DUT_MANAGER_USERS_URL || 'https://manage.dutai.io.vn/api/v1/users',
    { headers: { Authorization: `Bearer ${process.env.DUT_MANAGER_API_KEY}` } }
  )
  if (!response.ok) throw new Error(`Manage API returned ${response.status}`)
  const payload = await response.json()
  const remoteIds = new Set((payload.data || []).map((user) => Number(user.id)))
  const referencedIds = new Set([...projectRefs, ...blogRefs].map((row) => Number(row.id)))

  console.log(
    JSON.stringify({
      localUsers: localUsers.length,
      remoteUsers: remoteIds.size,
      localIdsMissingOnManage: localUsers
        .map((row) => Number(row.id))
        .filter((id) => !remoteIds.has(id)),
      referencedIdsMissingOnManage: [...referencedIds].filter((id) => !remoteIds.has(id)),
    })
  )
} finally {
  await sql.end()
}
