---
description: "Task list for Full Test Pyramid Suite (Unit, Integration & E2E)"
---

# Tasks: Full Test Pyramid Suite (Unit, Integration & E2E)

**Input**: Design documents from `/specs/010-full-test-pyramid-suite/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/test-matrix.md`  

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Belongs to User Story (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup (Shared Test Infrastructure)

**Purpose**: Initialize E2E test framework and test directory structure

- [x] T001 Install `@playwright/test` as devDependency in `frontend/package.json`
- [x] T002 [P] Create Playwright configuration in `frontend/playwright.config.ts` configuring Chromium, Firefox, WebKit, and local server integration
- [x] T003 [P] Create integration and E2E test directories: `frontend/tests/integration/helpers`, `frontend/tests/e2e/fixtures`

---

## Phase 2: Foundational (Test Helpers & Mock Contexts)

**Purpose**: Core request mocking and auth fixtures required by Integration and E2E test suites

**⚠️ CRITICAL**: Must complete before US2 and US3 tests can run

- [x] T004 [P] Implement Next.js request mocking helper in `frontend/tests/integration/helpers/mock-request.ts`
- [x] T005 [P] Implement authentication fixtures for Content and Member roles in `frontend/tests/e2e/fixtures/auth.fixture.ts`

**Checkpoint**: Shared test foundation ready - test implementations can begin

---

## Phase 3: User Story 1 - Comprehensive Unit Test Suite (Priority: P1) 🎯 MVP

**Goal**: Establish fast, deterministic unit tests for core utilities, date formatting, slugification, blog validators, and RBAC matrix.

**Independent Test**: Run `npm run test:unit` in < 3s with 100% passing tests.

- [x] T006 [P] [US1] Create unit tests for date utilities in `frontend/tests/unit/date-formatting.test.ts`
- [x] T007 [P] [US1] Create unit tests for slug generation in `frontend/tests/unit/slug-generator.test.ts`
- [x] T008 [P] [US1] Create unit tests for blog validators and excerpt extraction in `frontend/tests/unit/blog-validators.test.ts`
- [x] T009 [US1] Expand and verify RBAC access control tests in `frontend/tests/unit/rbac-partitioning.test.ts`
- [x] T010 [US1] Verify all unit tests pass with sub-second execution via `tsx --test tests/unit/*.test.ts`

**Checkpoint**: User Story 1 complete and independently verified.

---

## Phase 4: User Story 2 - Integration Test Suite for Route Handlers (Priority: P2)

**Goal**: Verify Next.js App Router route handlers and session lifecycles without requiring external network or live backend services.

**Independent Test**: Run `npm run test:integration` in < 5s verifying HTTP status codes and JSON payload contracts.

- [x] T011 [P] [US2] Create integration test for `/api/auth/me` in `frontend/tests/integration/auth-me-route.test.ts` (verifying 200 with session, 401 without)
- [x] T012 [P] [US2] Create integration test for `/api/auth/logout` in `frontend/tests/integration/auth-logout-route.test.ts` (verifying cookie clearing)
- [x] T013 [P] [US2] Create integration test for `/api/blogs` in `frontend/tests/integration/blogs-route.test.ts` (verifying post listing and pagination)
- [x] T014 [P] [US2] Create integration test for `/api/projects` in `frontend/tests/integration/projects-route.test.ts` (verifying project query response shape)
- [x] T015 [P] [US2] Create integration test for `/api/members` in `frontend/tests/integration/members-route.test.ts` (verifying member directory query)
- [x] T016 [US2] Verify all integration tests pass cleanly via `tsx --test tests/integration/*.test.ts`

**Checkpoint**: User Stories 1 AND 2 complete and passing independently.

---

## Phase 5: User Story 3 - Playwright E2E Suite & RBAC Smoke Testing (Priority: P3)

**Goal**: Automated browser validation of public visitor journeys, responsive navigation, and strict Content vs Member RBAC zoning against the local dev DB with teardown safety.

**Independent Test**: Run `npx playwright test` verifying real browser rendering and route protection.

- [x] T017 [P] [US3] Implement public navigation tests in `frontend/tests/e2e/public-navigation.spec.ts` (Home, Blogs, Detail, Events, Projects, Mobile nav)
- [x] T018 [P] [US3] Implement RBAC partitioning tests in `frontend/tests/e2e/rbac-guard.spec.ts` (Login redirect, Content access, Member portfolio isolation)
- [x] T019 [P] [US3] Implement admin smoke test and dev DB cleanup teardown in `frontend/tests/e2e/admin-smoke.spec.ts`
- [x] T020 [US3] Run Playwright tests headlessly and verify assertion passes

**Checkpoint**: All 3 tiers of the test pyramid functional.

---

## Phase 6: Polish, Unified Scripts & Build Verification

**Purpose**: Standardize npm scripts and enforce zero type errors and clean production build.

- [x] T021 Update `frontend/package.json` with scripts: `"test"`, `"test:unit"`, `"test:integration"`, `"test:e2e"`, `"test:all"`
- [x] T022 Run `npx tsc --noEmit` in `frontend/` to confirm 0 TypeScript compiler errors
- [x] T023 Run `npm run test` (unit + integration) to confirm 100% test pass rate
- [x] T024 Run `npm run build` in `frontend/` to confirm complete production build health

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Story 1 (Phase 3)**: Can run immediately after Phase 1.
- **User Story 2 (Phase 4)**: Depends on Phase 2 (mock helpers).
- **User Story 3 (Phase 5)**: Depends on Phase 2 (auth fixtures).
- **Polish (Phase 6)**: Depends on all user stories being implemented.

### Parallel Opportunities
- T002, T003 can run in parallel with T001.
- T004, T005 can run in parallel.
- Unit tests T006, T007, T008 can run in parallel.
- Integration tests T011, T012, T013, T014, T015 can run in parallel.
- E2E tests T017, T018, T019 can run in parallel.
