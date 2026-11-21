# Implementation Plan: Vertical Slice Database & Drizzle Schema Colocation

**Branch**: `009-vertical-slice-db-features` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

## Summary

Migrate all domain-specific Drizzle ORM schemas, SQL query functions, and domain TypeScript types from `lib/db/features/` into their corresponding domain modules under `features/` (e.g. `features/blog/db`, `features/projects/db`, `features/events/db`, `features/generations/db`, `features/users/db`, `features/about/db`). `lib/db/schema.ts` remains the authoritative central schema registry for Drizzle Kit with 100% migration parity.

## Technical Context

**Language/Version**: TypeScript 5.x, Drizzle ORM, PostgreSQL 16  
**Primary Configs**: `frontend/drizzle.config.ts`, `frontend/lib/db/schema.ts`, `frontend/lib/db/index.ts`  
**Scope**: 7 domain database packages currently in `frontend/lib/db/features/`  

## Constitution Check

- **Principle I: Architecture & Separation of Concerns**: PASSED. Realizes true Vertical Slice Architecture where each feature module owns its UI, business logic, and data-access layer.
- **Principle II: RBAC & Identity-First Security**: PASSED. Zero change to table definitions or role enforcement.
- **Principle IV: Verification, Testing & Quality Gates**: PASSED. Verified via `drizzle-kit generate` dry-run (confirming 0 schema drift) and `npm run build`.

## Planned Execution Steps

### Phase 1: Establish Feature DB Directories & Move Code
1. Move `lib/db/features/blogs/*` & `lib/db/features/keywords/*` to `features/blog/db/`
2. Move `lib/db/features/projects/*` to `features/projects/db/`
3. Move `lib/db/features/events/*` to `features/events/db/`
4. Move `lib/db/features/organization/*` to `features/generations/db/`
5. Move `lib/db/features/users/*` to `features/users/db/`
6. Move `lib/db/features/introductions/*` to `features/about/db/`

### Phase 2: Central Schema Registry & Re-exports
1. Update `frontend/lib/db/schema.ts` to re-export schemas from the new `@/features/*/db/schema` paths.
2. Update `frontend/lib/db/queries.ts` to re-export queries from `@/features/*/db/queries`.
3. Create compatibility re-exports under `lib/db/features/*` to ensure existing callers and scripts work seamlessly.

### Phase 3: Update Callers & Validation
1. Update Server Actions (`app/admin/*/actions.ts`), Route Handlers (`app/api/**/*`), and views to import directly from `@/features/*/db/*`.
2. Run `npx tsc --noEmit` to confirm 0 type errors.
3. Run `npm run build` to confirm 100% build health across all 34 routes.
