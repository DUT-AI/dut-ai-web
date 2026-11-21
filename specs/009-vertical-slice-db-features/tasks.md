---
description: "Task list for Vertical Slice Database & Drizzle Schema Colocation"
---

# Tasks: Vertical Slice Database & Drizzle Schema Colocation

**Input**: Design documents from `/specs/009-vertical-slice-db-features/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`  

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Belongs to User Story (`[US1]`)

---

## Phase 1: Setup & Target Directories Creation

**Purpose**: Create `db/` directories under each domain module in `frontend/features/`.

- [x] T001 Create database directories under `frontend/features/`: `features/blog/db`, `features/projects/db`, `features/events/db`, `features/generations/db`, `features/users/db`, `features/about/db`

---

## Phase 2: User Story 1 - Relocate Schemas, Queries & Types (Priority: P1) 🎯 MVP

**Goal**: Move database assets to corresponding domain modules while preserving exact table definitions and query functions.

- [x] T002 [P] [US1] Migrate Blog & Keywords DB: Move `lib/db/features/blogs/*` and `lib/db/features/keywords/*` to `frontend/features/blog/db/`
- [x] T003 [P] [US1] Migrate Projects DB: Move `lib/db/features/projects/*` to `frontend/features/projects/db/`
- [x] T004 [P] [US1] Migrate Events DB: Move `lib/db/features/events/*` to `frontend/features/events/db/`
- [x] T005 [P] [US1] Migrate Generations & Organization DB: Move `lib/db/features/organization/*` to `frontend/features/generations/db/`
- [x] T006 [P] [US1] Migrate Users & Portfolio DB: Move `lib/db/features/users/*` to `frontend/features/users/db/`
- [x] T007 [P] [US1] Migrate Introductions & About DB: Move `lib/db/features/introductions/*` to `frontend/features/about/db/`
- [x] T008 [US1] Update `frontend/lib/db/schema.ts` to re-export domain schemas directly from `@/features/*/db/schema`
- [x] T009 [US1] Update `frontend/lib/db/queries.ts` to re-export queries from `@/features/*/db/queries`
- [x] T010 [US1] Create compatibility re-export layers in `frontend/lib/db/features/*` to ensure zero breaking changes for existing callers

**Checkpoint**: Run `npx tsc --noEmit` to verify all schema and query re-exports compile cleanly.

---

## Phase 3: Caller Migration & Import Modernization

**Purpose**: Update direct callers in `frontend/app/` to import directly from `@/features/*/db/*`.

- [x] T011 [US1] Update admin actions and pages in `frontend/app/admin/` to import directly from `@/features/*/db/*`
- [x] T012 [US1] Update public pages in `frontend/app/` (`/projects`, `/members`, `/blog`, `/events`) to import from `@/features/*/db/*`
- [x] T013 [US1] Update route handlers in `frontend/app/api/` to import from `@/features/*/db/*`

---

## Phase 4: Polish, Schema Drift Check & Build Verification

**Purpose**: Verify zero schema migration drift and complete production build health.

- [x] T014 Run `npx tsc --noEmit` in `frontend/` to confirm 0 TypeScript errors
- [x] T015 Verify Drizzle schema integrity by running `npm run db:generate` to confirm 0 diffs
- [x] T016 Run Next.js production build `npm run build` in `frontend/` to verify all 34 routes compile cleanly
