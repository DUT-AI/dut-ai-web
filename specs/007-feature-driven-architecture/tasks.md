---
description: "Task list for Feature-Driven / Modular Architecture Refactoring"
---

# Tasks: Feature-Driven / Modular Architecture Refactoring

**Input**: Design documents from `/specs/007-feature-driven-architecture/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/module-contracts.md`, `quickstart.md`  

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Belongs to User Story (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup & Path Configuration

**Purpose**: Establish new path aliases and baseline module infrastructure.

- [x] T001 Update TypeScript configuration with `@/features/*` and updated alias mappings in `frontend/tsconfig.json`
- [x] T002 [P] Create initial feature directories skeleton under `frontend/features/` (`auth`, `blog`, `portfolio`, `events`, `generations`, `projects`)
- [x] T003 [P] Relocate helper `frontend/app/api-client.ts` to `frontend/lib/api-client.ts` and update internal references

---

## Phase 2: Foundational (Shared & Layout Primitives)

**Purpose**: Organize cross-cutting UI components and eliminate clutter in `frontend/components/` root.

- [x] T004 Create `frontend/components/layout/` directory and move framing components (`Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, `ThemeSwitch.tsx`, `SectionContainer.tsx`, `LayoutWrapper.tsx`, `PageTitle.tsx`)
- [x] T005 [P] Create `frontend/components/common/` directory and move shared widgets (`Link.tsx`, `Image.tsx`, `CopyButton.tsx`, `SparkleIcon.tsx`, `SocialShare.tsx`, `ScrollTopAndComment.tsx`, `SearchButton.tsx`, `DutaiWaffle.tsx`)
- [x] T006 Update import paths in `frontend/app/layout.tsx`, `frontend/app/page.tsx`, and `frontend/app/admin/layout.tsx` to reference `components/layout/*` and `components/common/*`

**Checkpoint**: Core shared components partitioned. Verify `npx tsc --noEmit` compiles without missing layout imports.

---

## Phase 3: User Story 1 - Maintain and Scale Features Autonomously (Priority: P1) 🎯 MVP

**Goal**: Encapsulate all bounded business domain assets into `frontend/features/<domain>/` with zero functional regressions.

- [x] T007 [P] [US1] Migrate Auth feature: Move `context/SsoAuthContext.tsx` and `components/auth/UserMenuDropdown.tsx` to `frontend/features/auth/`
- [x] T008 [P] [US1] Migrate Blog feature: Move `components/MDXComponents.tsx`, `Comments.tsx`, `Pre.tsx`, `TableOfContents.tsx`, `RelatedPosts.tsx`, `Tag.tsx`, `components/admin/MarkdownEditor.tsx`, `components/admin/NotionZipImportDialog.tsx` to `frontend/features/blog/components/`
- [x] T009 [P] [US1] Migrate Events feature: Move `components/events/*` to `frontend/features/events/components/`
- [x] T010 [P] [US1] Migrate Generations feature: Move `components/about/GenerationAlbum.tsx` and `components/about/MemberDetailModal.tsx` to `frontend/features/generations/components/`
- [x] T011 [P] [US1] Migrate Projects feature: Move `app/projects/ProjectsListClient.tsx` and `app/projects/components/*` to `frontend/features/projects/components/`
- [x] T012 [P] [US1] Migrate Portfolio feature: Move `components/portfolio/*` and `components/admin/portfolio/*` to `frontend/features/portfolio/components/`
- [x] T013 [US1] Batch-update all import statements in `frontend/app/` (Admin routes, Public routes, API routes) to consume components from `@/features/*`

**Checkpoint**: All business domains isolated in `features/`. Run `npx tsc --noEmit` to verify type integrity across all 6 features.

---

## Phase 4: User Story 2 - Clean and Discoverable Shared Components (Priority: P2)

**Goal**: Prune root `frontend/components/` so only `ui/`, `layout/`, `common/`, `home/`, and `about/` remain.

- [x] T014 [US2] Audit `frontend/components/` root and remove any obsolete duplicate files or empty folders
- [x] T015 [P] [US2] Verify `frontend/components/ui/` components remain strictly decoupled from any `@/features/*` imports
- [x] T016 [US2] Verify `frontend/components/home/` and `frontend/components/about/` render cleanly with updated common/layout component imports

**Checkpoint**: Root `frontend/components/` contains zero loose domain files.

---

## Phase 5: User Story 3 - Elimination of Legacy Starter Debt (Priority: P3)

**Goal**: Modernize and absorb legacy starter artifacts (`layouts/`) into their respective features.

- [x] T017 [US3] Move `frontend/layouts/BlogListLayout.tsx` and `frontend/layouts/PostLayoutAPI.tsx` to `frontend/features/blog/components/`
- [x] T018 [US3] Move `frontend/layouts/EventsListLayout.tsx` to `frontend/features/events/components/`
- [x] T019 [US3] Update all imports in `frontend/app/blog/`, `frontend/app/events/` and remove the legacy `frontend/layouts/` directory
- [x] T020 [US3] Verify no utility or client helpers remain loose directly in `frontend/app/`

**Checkpoint**: Legacy `layouts/` directory completely removed.

---

## Phase 6: Polish & Verification

**Purpose**: System-wide validation, linting, and production build checks.

- [x] T021 Run `npx tsc --noEmit` in `frontend/` to ensure 0 TypeScript errors across the entire codebase
- [x] T022 [P] Run Prettier formatting and ESLint across modified files: `npx prettier --write "features/**/*.{ts,tsx}" "components/**/*.{ts,tsx}" "lib/**/*.{ts,tsx}" "app/**/*.{ts,tsx}"`
- [x] T023 Run production build `npm run build` in `frontend/` to confirm all 34 routes compile cleanly
- [x] T024 [P] Run unit test suite `npm run test` in `frontend/` to confirm zero regression on existing tests
