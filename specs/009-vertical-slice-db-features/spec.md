# Feature Specification: Vertical Slice Database & Drizzle Schema Colocation

**Feature Branch**: `009-vertical-slice-db-features`  
**Created**: 2026-11-21  
**Status**: Draft  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Vertical Slice Encapsulation per Domain (Priority: P1)
As a developer maintaining or extending a specific domain (e.g. `blog`, `projects`, `events`, `generations`, `portfolio`, `users`), I want all database models, Drizzle schemas, SQL queries, and TypeScript domain types to reside directly within that domain's feature module (`features/<domain>/`), so that domain logic and data persistence are truly encapsulated together (Vertical Slice Architecture) rather than divided across separate directories.

**Independent Test**: Verify that `features/blog`, `features/projects`, `features/events`, `features/generations`, `features/portfolio`, and `features/users` own their respective `schema.ts`, `queries.ts`, and `types.ts`, with `lib/db/schema.ts` acting as a central registry re-exporting them for Drizzle Kit and migrations.

**Acceptance Scenarios**:
1. **Given** a developer inspecting `frontend/features/blog/`, **When** exploring the file tree, **Then** they find `schema.ts`, `queries.ts`, `types.ts`, and `components/` unified under that domain.
2. **Given** Drizzle Kit running schema migrations (`npm run db:generate` or `drizzle.config.ts`), **When** reading `lib/db/schema.ts`, **Then** all domain tables compile identically without changing migration snapshots.
3. **Given** any existing Server Action or Route Handler querying data, **When** executing queries, **Then** results and types match 100% with zero runtime or type errors.

## Success Criteria *(mandatory)*
- **SC-001**: Domain schemas and queries relocated to `features/<domain>/`.
- **SC-002**: `lib/db/schema.ts` cleanly re-exports all domain schemas to maintain 100% compatibility with `drizzle.config.ts` and Drizzle migrations.
- **SC-003**: 0 TypeScript compilation errors (`npx tsc --noEmit`).
- **SC-004**: Production build (`npm run build`) passes cleanly with exit code 0.
