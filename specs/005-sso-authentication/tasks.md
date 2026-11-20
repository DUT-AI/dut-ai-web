# Tasks: DUT-AI Ecosystem Single Sign-On (SSO) Integration

**Input**: Design documents from `/specs/005-sso-authentication/`  
**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3], [US4], [US5])
- Exact file paths are specified for every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment configuration, constants, and shared type definitions

- [X] T001 Configure SSO environment constants (`SSO_LOGIN_URL`, `DUTAI_MANAGE_API_URL`, `SSO_COOKIE_DOMAIN`) and update `.env.example` in `frontend/.env.example`
- [X] T002 [P] Define core SSO TypeScript interfaces (`DutAiUserProfile`, `JwtTokenPayload`, `SsoSession`, `CookieConfigOptions`) in `frontend/lib/auth-sso.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core cryptographic helpers, cookie domain management, and IdP fetch utilities that all user stories depend on

**⚠️ CRITICAL**: Must complete before user story implementation begins

- [X] T003 Implement lightweight JWT Base64 payload decoding (`decodeJwtPayload`) and expiration validation (`isTokenValid`) in `frontend/lib/auth-sso.ts`
- [X] T004 [P] Implement environment-aware cookie options resolver (`getSsoCookieOptions`) supporting both `.dutai.io.vn` domain in production and localhost fallback in `frontend/lib/auth-sso.ts`
- [X] T005 Implement central Identity Provider fetcher (`fetchCurrentSsoUser`) calling `GET https://manage.dutai.io.vn/api/v1/auth/me` with React request cache in `frontend/lib/auth-sso.ts`
- [X] T006 Implement proxy API route `GET /api/auth/me` in `frontend/app/api/auth/me/route.ts` extracting `access_token` and returning the authenticated user profile or 401 status

**Checkpoint**: Core foundational utilities ready - User Story implementation can proceed.

---

## Phase 3: User Story 1 - Seamless Shared Cross-Subdomain Authentication (Priority: P1) 🎯 MVP

**Goal**: Users with an active session on any `.dutai.io.vn` ecosystem subdomain can enter this web application without a separate login prompt, and their identity is automatically recognized.

**Independent Test**: In a browser containing a valid `access_token` cookie for `.dutai.io.vn`, load the application and verify that `GET /api/auth/me` and server-rendered components successfully recognize the user without prompting for login.

- [X] T007 [US1] Implement server-side session resolver (`getSsoServerSession`) in `frontend/lib/auth-sso-server.ts` to read cookies in Next.js Server Components and Server Actions
- [X] T008 [US1] Update `frontend/lib/admin-auth.ts` to integrate with `fetchCurrentSsoUser` and shared SSO session tokens while maintaining backward compatibility for admin utilities

**Checkpoint**: User Story 1 is functional as an independent MVP.

---

## Phase 4: User Story 2 - Protected Route Guarding & Central Login Redirection (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated visitors attempting to access restricted administrative or private member areas are intercepted and redirected to the central login portal (`https://workspace.dutai.io.vn/login?redirect={current_url}`), while public routes remain freely accessible.

**Independent Test**: In an incognito browser window without cookies, navigate to `http://localhost:3000/admin`. Verify immediate redirection to `https://workspace.dutai.io.vn/login?redirect=...`. Then navigate to `http://localhost:3000/blog` and verify normal public access without redirect.

- [X] T009 [US2] Implement Route Protection Rules matcher in `frontend/middleware.ts` defining protected patterns (`/admin/:path*`), public patterns, and static bypasses
- [X] T010 [US2] Implement Edge JWT expiration and presence inspection in `frontend/middleware.ts` to redirect unauthenticated or expired tokens to `https://workspace.dutai.io.vn/login?redirect={encodeURIComponent(currentUrl)}`
- [X] T011 [US2] Update `frontend/app/admin/login/page.tsx` to automatically redirect visitors to the central portal with destination URL or provide a direct "Đăng nhập qua DUT-AI Workspace Hub" SSO action

**Checkpoint**: User Stories 1 AND 2 combined provide a complete, secure authentication gateway.

---

## Phase 5: User Story 3 - Role-Based Access Control (RBAC) & Profile Context (Priority: P2)

**Goal**: User profile, assigned roles, and granular permissions are made available throughout the application via React Context, enabling UI elements and routes to enforce role-based permissions.

**Independent Test**: Authenticate as a user with member-only roles and verify administrative management features are restricted with an access notice; authenticate as an administrator and confirm full management access.

- [X] T012 [US3] Create `SsoAuthContext` and custom hook `useSsoAuth` providing `user`, `isLoading`, `isAuthenticated`, `hasRole`, `hasPermission`, and `refresh` in `frontend/context/SsoAuthContext.tsx`
- [X] T013 [US3] Wrap root application tree with `<SsoAuthProvider>` in `frontend/app/layout.tsx`
- [X] T014 [US3] Update admin dashboard layout in `frontend/app/admin/layout.tsx` to consume `useSsoAuth()` for dynamic admin avatar, display name, and role badges

**Checkpoint**: User Stories 1, 2, and 3 work cohesively with global RBAC state.

---

## Phase 6: User Story 4 - Unified Single Sign-Out (Single Logout) (Priority: P2)

**Goal**: Logging out from this web application invalidates shared session credentials across `.dutai.io.vn` and redirects the user to the central login portal.

**Independent Test**: Click "Đăng xuất" in the application; verify that `POST /api/auth/logout` sets `Max-Age=0` on `access_token` and `refresh_token` for domain `.dutai.io.vn`; verify browser redirects to `https://workspace.dutai.io.vn/login`; verify subsequent `/admin` access requires login.

- [X] T015 [US4] Implement Single Sign-Out API route `POST /api/auth/logout` in `frontend/app/api/auth/logout/route.ts` clearing `access_token` and `refresh_token` on domain `.dutai.io.vn` (`Max-Age=0`, `HttpOnly`, `SameSite=Lax`, `Secure`)
- [X] T016 [US4] Update `logoutAdminAction` in `frontend/app/admin/actions.ts` to execute the SSO cookie invalidation flow
- [X] T017 [US4] Implement `logout()` method in `frontend/context/SsoAuthContext.tsx` that calls `/api/auth/logout` and redirects browser to `https://workspace.dutai.io.vn/login`

**Checkpoint**: User Stories 1 through 4 provide full lifecycle authentication and single logout.

---

## Phase 7: User Story 5 - Contextual Session State on Public Pages (Priority: P3)

**Goal**: Public application header dynamically adapts: displaying an avatar dropdown menu when authenticated, or a sleek "Đăng nhập" button linking to the central portal when unauthenticated.

**Independent Test**: Visit the public homepage as a guest and verify the "Đăng nhập" button appears; visit while authenticated and verify the user avatar, name, and action menu appear.

- [X] T018 [P] [US5] Create `UserMenuDropdown` component in `frontend/components/auth/UserMenuDropdown.tsx` rendering avatar image, display name, email, role badge, Admin link (if authorized), and Logout button
- [X] T019 [US5] Update `frontend/components/Header.tsx` to consume `useSsoAuth()`, displaying `UserMenuDropdown` when authenticated or a "Đăng nhập" button linking to `https://workspace.dutai.io.vn/login?redirect={encodeURIComponent(pathname)}` when unauthenticated

**Checkpoint**: All user stories implemented across both public and private UI surfaces.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Local development experience, CORS alignment, and final build validation

- [X] T020 [P] Update `frontend/lib/cors.ts` to ensure cross-subdomain API interactions allow credentials across `*.dutai.io.vn`
- [X] T021 Add local development token injection helper or fallback guidance in `frontend/app/api/auth/me/route.ts` for offline testing on `localhost:3000`
- [X] T022 Run complete code quality verification suite (`npm run lint` and `npm run build` in `frontend/`) ensuring zero TypeScript compilation errors and zero lint warnings

---

## Dependencies & Story Execution Order

```
Phase 1: Setup (T001, T002)
       │
       ▼
Phase 2: Foundational (T003, T004, T005, T006)
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
Phase 3: User Story 1 (P1)        Phase 4: User Story 2 (P1)
[Shared Cross-Subdomain SSO]      [Route Guard & Redirection]
(T007, T008)                      (T009, T010, T011)
       │                                 │
       └────────────────┬────────────────┘
                        ▼
       Phase 5: User Story 3 (P2)
       [RBAC & Profile Context]
       (T012, T013, T014)
                        │
                        ▼
       Phase 6: User Story 4 (P2)
       [Single Sign-Out (SLO)]
       (T015, T016, T017)
                        │
                        ▼
       Phase 7: User Story 5 (P3)
       [Public Header Awareness]
       (T018, T019)
                        │
                        ▼
       Phase 8: Polish & Validation
       (T020, T021, T022)
```

---

## Parallel Execution Opportunities

- **Phase 1 & 2**: `T002` (Types) and `T004` (Cookie resolver) can run in parallel.
- **Phase 3 & 4**: Once Phase 2 is complete, `User Story 1` (Server session resolver) and `User Story 2` (Middleware route guard) can be developed concurrently as they touch different files (`lib/auth-sso.ts` vs `middleware.ts`).
- **Phase 7**: `T018` (`UserMenuDropdown.tsx`) can be implemented in parallel with Phase 6 before integrating into `Header.tsx` in `T019`.
- **Phase 8**: `T020` (CORS) can run in parallel with polish tasks.

---

## Implementation Strategy & MVP Scope

- **Suggested MVP**: Phases 1, 2, 3, and 4 (Tasks T001–T011).
  - This establishes the core security perimeter: seamless access for authenticated users across `*.dutai.io.vn` and automatic redirection to `https://workspace.dutai.io.vn/login` for unauthenticated visitors attempting to access `/admin/*`.
- **Incremental Delivery**:
  - Increment 1: MVP (US1 + US2) — Core SSO login & Route Guard.
  - Increment 2: RBAC & Profile (US3) — User context, avatar in admin dashboard.
  - Increment 3: Single Logout (US4) — Cross-subdomain session termination.
  - Increment 4: Public UI Integration (US5) — Header dynamic avatar dropdown & login button.
