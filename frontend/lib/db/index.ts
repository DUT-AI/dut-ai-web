import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Construct Database Connection URL from environment variables
function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  const user = process.env.POSTGRES_USER || 'dutai'
  const password = process.env.POSTGRES_PASSWORD || 'dutai'
  const host = process.env.POSTGRES_HOST || 'localhost'
  const port = process.env.POSTGRES_PORT || '5432'
  const database = process.env.POSTGRES_DB || 'dut-ai-web'

  return `postgresql://${user}:${password}@${host}:${port}/${database}`
}

declare global {
  // eslint-disable-next-line no-var
  var globalDb: PostgresJsDatabase<typeof schema> | undefined
  // eslint-disable-next-line no-var
  var globalSql: postgres.Sql | undefined
}

let db: PostgresJsDatabase<typeof schema>
let client: postgres.Sql

const connectionString = getDatabaseUrl()

if (process.env.NODE_ENV === 'production') {
  client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })
  db = drizzle(client, { schema })
} else {
  if (!global.globalSql) {
    global.globalSql = postgres(connectionString, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  client = global.globalSql
  if (!global.globalDb) {
    global.globalDb = drizzle(client, { schema })
  }
  db = global.globalDb
}

export { db, client }
export * from './schema'
