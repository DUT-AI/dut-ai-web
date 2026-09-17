import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '../.env' })

const user = process.env.POSTGRES_USER || 'dutai'
const password = process.env.POSTGRES_PASSWORD || 'dutai'
const host = process.env.POSTGRES_HOST || 'localhost'
const port = process.env.POSTGRES_PORT || '5432'
const database = process.env.POSTGRES_DB || 'dut-ai-web'

const url =
  process.env.DATABASE_URL ||
  `postgresql://${user}:${password}@${host}:${port}/${database}`

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
})
