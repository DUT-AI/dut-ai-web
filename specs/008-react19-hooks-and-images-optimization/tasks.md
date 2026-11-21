---
description: "Task list for React 19 Hooks and Next.js Images Optimization"
---

# Tasks: React 19 Hooks and Next.js Images Optimization

**Input**: Design documents from `/specs/008-react19-hooks-and-images-optimization/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `quickstart.md`  

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Belongs to User Story (`[US1]`, `[US2]`)

---

## Phase 1: Setup & Foundational Hooks

**Purpose**: Establish a robust hydration hook using React 19 `useSyncExternalStore`.

- [x] T001 Create client hydration hook `useIsMounted()` in `frontend/lib/hooks/useIsMounted.ts`
- [x] T002 [P] Export `useIsMounted` via `frontend/lib/hooks/index.ts`

---

## Phase 2: User Story 1 - Eliminate React 19 Cascading Renders & Conditional Hooks (Priority: P1) 🎯 MVP

**Goal**: Fix all `react-hooks/set-state-in-effect` and `react-hooks/rules-of-hooks` errors across client components.

- [x] T003 [P] [US1] Refactor `frontend/components/layout/ThemeSwitch.tsx` to use `useIsMounted()` instead of synchronous `useEffect(setMounted(true))`
- [x] T004 [P] [US1] Refactor `frontend/components/layout/MobileNav.tsx` to use `useIsMounted()` instead of synchronous `useEffect(setMounted(true))`
- [x] T005 [P] [US1] Refactor `frontend/features/blog/components/MarkdownEditor.tsx` to use `useIsMounted()`
- [x] T006 [P] [US1] Refactor `frontend/features/events/components/EventsListLayout.tsx` to use `useIsMounted()`
- [x] T007 [P] [US1] Refactor `frontend/app/admin/generations/MemberSearchSelect.tsx` to remove `setActiveIndex(0)` and `setSearchQuery('')` from `useEffect`, handling them in event callbacks
- [x] T008 [P] [US1] Fix conditional hook in `frontend/features/blog/components/RelatedPosts.tsx` by moving all `useEffect` calls above early return statements
- [x] T009 [P] [US1] Refactor `frontend/features/blog/components/BlogListLayout.tsx` to eliminate synchronous state reset inside `useEffect`
- [x] T010 [P] [US1] Refactor `frontend/features/blog/components/PostLayoutAPI.tsx` to defer `setViewCount` out of synchronous effect execution

**Checkpoint**: Run `npx eslint .` to verify that all 8 React Hook errors are resolved.

---

## Phase 3: User Story 2 - Convert Raw `<img>` Tags to Next.js `<Image />` (Priority: P2)

**Goal**: Replace all unoptimized `<img>` tags with `next/image` in admin consoles and components.

- [x] T011 [P] [US2] Replace `<img>` with `<Image />` in `frontend/app/admin/blogs/components/BlogAuthorsSection.tsx`
- [x] T012 [P] [US2] Replace `<img>` with `<Image />` in `frontend/app/admin/blogs/components/BlogCoverImageSection.tsx`
- [x] T013 [P] [US2] Replace `<img>` with `<Image />` in `frontend/app/admin/events/PublicEventForm.tsx` and `frontend/app/admin/events/page.tsx`
- [x] T014 [P] [US2] Replace `<img>` with `<Image />` in `frontend/app/admin/posts/PostForm.tsx` and `frontend/app/admin/posts/page.tsx`
- [x] T015 [P] [US2] Replace `<img>` with `<Image />` in `frontend/app/admin/projects/ProjectForm.tsx` and `frontend/app/admin/projects/page.tsx`
- [x] T016 [P] [US2] Ensure all new `<Image />` elements specify `unoptimized` for local/blob/MinIO URLs and include explicit width/height or `fill` with aspect ratios

**Checkpoint**: Run `npx eslint .` to verify 0 `@next/next/no-img-element` warnings remain.

---

## Phase 4: Polish & System-Wide Verification

**Purpose**: Ensure zero regressions across linting, type-checking, and build pipelines.

- [x] T017 Run `npx eslint .` across the frontend repository to confirm 0 errors and 0 critical warnings
- [x] T018 Run `npx tsc --noEmit` to verify complete TypeScript safety
- [x] T019 Run Next.js production build `npm run build` to confirm all 34 routes compile cleanly
