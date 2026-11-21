/**
 * Central schema registry re-exporting domain schemas by feature.
 * Used as the primary schema entrypoint for Drizzle Kit and migrations.
 */

export * from './utils'
export * from '@/features/projects/db/schema'
export * from '@/features/blog/keywords/schema'
export * from '@/features/blog/db/schema'
export * from '@/features/events/db/schema'
export * from '@/features/about/db/schema'
export * from '@/features/generations/db/schema'
export * from '@/features/users/db/schema'
