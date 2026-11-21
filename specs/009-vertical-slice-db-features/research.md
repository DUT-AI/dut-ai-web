# Research & Architecture: Vertical Slice Database & Drizzle Schema Colocation

**Feature**: `009-vertical-slice-db-features`  
**Date**: 2026-11-21  

## 1. Domain Mapping from `lib/db/features/` to `features/`

| Current `lib/db/features/` Module | Target Feature Module | Content |
| :--- | :--- | :--- |
| `lib/db/features/blogs/*` | `features/blog/db/` (or `features/blog/`) | Blog tables, queries, types |
| `lib/db/features/keywords/*` | `features/blog/keywords/` or `features/keywords/` | Keyword relations & queries |
| `lib/db/features/projects/*` | `features/projects/db/` | Projects tables, queries, types |
| `lib/db/features/events/*` | `features/events/db/` | Events & Posts tables, queries, timeline, types |
| `lib/db/features/organization/*` | `features/generations/db/` | Generation album tables, queries, types |
| `lib/db/features/users/*` | `features/users/db/` (or `features/portfolio/db/`) | Members, CV, portfolio schema, queries, types |
| `lib/db/features/introductions/*` | `features/about/db/` | Introduction & About queries/schema |

## 2. Maintaining Drizzle Kit & Migration Integrity

- `drizzle.config.ts` points to `./lib/db/schema.ts`.
- In `./lib/db/schema.ts`, we centralize re-exports:
  ```typescript
  export * from './utils'
  export * from '@/features/projects/db/schema'
  export * from '@/features/blog/db/schema'
  export * from '@/features/events/db/schema'
  export * from '@/features/generations/db/schema'
  export * from '@/features/users/db/schema'
  export * from '@/features/about/db/schema'
  ```
- **Crucial Rule**: Table names, column names, constraints, and relationships remain **completely unchanged** so that `drizzle-kit generate` produces 0 new diffs (zero schema drift).

## 3. Backward Compatibility Layer

To avoid breaking external scripts (like `scripts/audit-external-user-ids.mjs` or `scripts/test-db.ts`), we can maintain lightweight re-exports in `lib/db/features/*` pointing to `@/features/*/db/*`.
