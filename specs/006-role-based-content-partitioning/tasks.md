# Tasks: Role-Based Content & Member Partitioning

**Input**: Design documents from `/specs/006-role-based-content-partitioning/`  
**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3], [US4], [US5])
- Exact file paths are specified for every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Role definitions, partition schemas, and core configuration

- [X] T001 [P] Extend `UserRole` enum with `CONTENT = 'Content'` and add its entry to `USER_ROLE_DETAILS` in `frontend/lib/enums/roles.ts`
- [X] T002 [P] Define `FunctionalPartition` types, partition constants, and route mappings in `frontend/lib/enums/roles.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core role evaluation helpers, partition routing matchers, and server guard utilities that all user stories depend on

**⚠️ CRITICAL**: Must complete before user story implementation begins

- [X] T003 Implement case-insensitive role checking helper `hasContentAccess(userOrRoles)` supporting `'content'` and `'admin'` in `frontend/lib/enums/roles.ts`
- [X] T004 [P] Implement `getPartitionForPath(pathname)` helper in `frontend/lib/enums/roles.ts` to categorize incoming URLs into `'CONTENT_MANAGEMENT'` vs `'MEMBER_INFO'`
- [X] T005 Add `isContentManager` convenience boolean flag to `SsoAuthContextType` and `useSsoAuth()` in `frontend/context/SsoAuthContext.tsx`
- [X] T006 Implement `requireContentSession()` server guard in `frontend/lib/admin-auth.ts` to validate Content or Admin role on Next.js Server Actions

**Checkpoint**: Core foundational utilities ready - User Story implementation can proceed.

---

## Phase 3: User Story 1 - Content Role Administrative Access to Content Zone (Priority: P1) 🎯 MVP

**Goal**: Users possessing the "Content" role (or "admin") have unrestricted access to all administrative content management modules (Blogs, Projects, Events, Moments, Generations, Keywords, Intro, and Dashboard Overview).

**Independent Test**: Sign in with an account having `role_names: ["Content"]`. Navigate to `/admin` and each content management module (`/admin/blogs`, `/admin/projects`, etc.). Verify that access is fully granted and content items load without permission errors.

- [X] T007 [US1] Update `AdminLayout` in `frontend/app/admin/layout.tsx` to verify `isContentManager` and allow authorized Content users to view all content management routes
- [X] T008 [US1] Update Overview dashboard in `frontend/app/admin/page.tsx` to ensure operational metrics and quick cards load smoothly for Content role users

**Checkpoint**: User Story 1 is functional as an independent MVP.

---

## Phase 4: User Story 2 - General Member Access to Member Information Zone & Content Restriction (Priority: P1) 🎯 MVP

**Goal**: Authenticated general members without the "Content" role are restricted to the "Thông tin thành viên" partition (`/admin/portfolio`), and any attempts to access Content Management routes are intercepted and redirected gracefully.

**Independent Test**: Sign in with a standard member account lacking the "Content" role. Navigate to `/admin/portfolio` and confirm full portfolio editing access. Then attempt to access `/admin` or `/admin/blogs` directly, verifying immediate redirection to `/admin/portfolio` with an explanatory notification.

- [X] T009 [US2] Update Edge Middleware in `frontend/middleware.ts` to inspect JWT payload claims on Content zone routes and redirect unauthorized members to `/admin/portfolio?denied=content`
- [X] T010 [US2] Implement client-side route guard in `frontend/app/admin/layout.tsx` that detects unauthorized access to Content routes and redirects to `/admin/portfolio`
- [X] T011 [US2] Implement toast notification in `frontend/app/admin/layout.tsx` detecting `?denied=content` search param and displaying an explanatory warning to redirected members

**Checkpoint**: User Stories 1 AND 2 combined provide complete partition boundary enforcement.

---

## Phase 5: User Story 3 - Server-Side & Mutation Authorization Guarding (Priority: P2)

**Goal**: Enforce authorization checks across all backend server actions to ensure unauthorized users cannot mutate content records via direct requests.

**Independent Test**: Invoke a blog or project mutation server action from a non-Content session. Confirm that the action returns `{ success: false, error: 'FORBIDDEN_CONTENT_ROLE_REQUIRED' }` and no database record changes.

- [X] T012 [P] [US3] Secure blog mutation server actions in `frontend/app/admin/blogs/actions.ts` using `requireContentSession()`
- [X] T013 [P] [US3] Secure project mutation server actions in `frontend/app/admin/projects/actions.ts` using `requireContentSession()`
- [X] T014 [P] [US3] Secure event mutation server actions in `frontend/app/admin/events/actions.ts` using `requireContentSession()`
- [X] T015 [P] [US3] Secure moment mutation server actions in `frontend/app/admin/posts/actions.ts` using `requireContentSession()`
- [X] T016 [P] [US3] Secure generation album mutation server actions in `frontend/app/admin/generations/actions.ts` using `requireContentSession()`
- [X] T017 [P] [US3] Secure SEO keyword mutation server actions in `frontend/app/admin/keywords/actions.ts` using `requireContentSession()`
- [X] T018 [P] [US3] Secure introduction mutation server actions in `frontend/app/admin/introductions/actions.ts` using `requireContentSession()`

**Checkpoint**: User Stories 1, 2, and 3 guarantee multi-layer security from Edge to Database.

---

## Phase 6: User Story 4 - Dynamic Navigation Shell & User Dropdown Adaptation (Priority: P2)

**Goal**: Administrative sidebar and global header user dropdown adapt dynamically, presenting only the partitions each user is authorized to access.

**Independent Test**: Sign in under both a Content role and a non-Content role. Verify that Content users see both sidebar sections (`QUẢN LÝ NỘI DUNG` & `THÔNG TIN THÀNH VIÊN`), while non-Content users see only `THÔNG TIN THÀNH VIÊN` and have a direct header link to "Hồ sơ cá nhân".

- [X] T019 [US4] Reorganize `NAV_ITEMS` in `frontend/app/admin/layout.tsx` into partitioned sections (`QUẢN LÝ NỘI DUNG` and `THÔNG TIN THÀNH VIÊN`), rendering Content items only when `isContentManager` is true
- [X] T020 [US4] Update `UserMenuDropdown` in `frontend/components/auth/UserMenuDropdown.tsx` to conditionally show "Bảng quản trị (Admin)" for Content managers while directing general members straight to "Hồ sơ cá nhân" (`/admin/portfolio`)

**Checkpoint**: Navigation shell matches authorization boundaries seamlessly.

---

## Phase 7: User Story 5 - Content Creator Self-Portfolio Management (Priority: P3)

**Goal**: Content creators who are also active club members can access and manage their own portfolio at `/admin/portfolio` without restriction.

**Independent Test**: Sign in as a Content user, navigate to `/admin/portfolio`, and confirm that the user can seamlessly view and edit their own member portfolio.

- [X] T021 [US5] Verify and ensure `/admin/portfolio` route and server actions in `frontend/app/admin/portfolio/` remain accessible to both Content users and standard members without conflict

**Checkpoint**: All 5 user stories are complete and operational.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Build verification, linting, formatting, and end-to-end regression testing

- [X] T022 Run TypeScript compilation (`npx tsc --noEmit`) to verify strict typing across all touched files in `frontend/`
- [X] T023 Run ESLint (`npm run lint`) and code formatting (`npx prettier --write`) in `frontend/`
- [X] T024 Run production build (`npm run build`) in `frontend/` to confirm zero compilation errors
- [X] T025 Execute manual quickstart verification scenarios per `specs/006-role-based-content-partitioning/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately (T001, T002 in parallel).
- **Foundational (Phase 2)**: Depends on Phase 1 completion. BLOCKS all user stories.
- **User Story 1 (Phase 3)** & **User Story 2 (Phase 4)**: Depend on Phase 2. Forms the core MVP.
- **User Story 3 (Phase 5)** & **User Story 4 (Phase 6)**: Depend on Phase 3 and Phase 4.
- **User Story 5 (Phase 7)**: Depends on Phase 4.
- **Polish (Phase 8)**: Depends on completion of all user stories.

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T004 can run in parallel with T003.
- **Phase 5**: T012 through T018 can all execute in parallel across their separate action files.
- **Phase 8**: T022, T023 can run concurrently.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup (`roles.ts`).
2. Complete Phase 2: Foundational (`hasContentAccess`, `getPartitionForPath`, `isContentManager`, `requireContentSession`).
3. Complete Phase 3: Content role access to Content zone (`layout.tsx`, `page.tsx`).
4. Complete Phase 4: General member restriction & Edge redirect (`middleware.ts`, `layout.tsx`).
5. **STOP and VALIDATE**: Verify with both a Content session and a non-Content session.

### Incremental Delivery

1. Foundation + Core Boundaries (Phases 1-4) → MVP ready.
2. Secure backend mutations (Phase 5) → Data integrity guaranteed.
3. UI shell refinement (Phase 6) → Clean, adaptive user experience.
4. Self-portfolio verification (Phase 7) → Content creator operational parity.
5. Final quality gate (Phase 8) → Production verification.
