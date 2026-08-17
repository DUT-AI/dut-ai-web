import { customType } from 'drizzle-orm/pg-core'

// Custom type for PostgreSQL tsvector
export const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

// Date formatter helper for ISO strings
export function formatDate(date: Date | null | undefined): string | undefined {
  if (!date) return undefined
  return date instanceof Date ? date.toISOString() : String(date)
}
