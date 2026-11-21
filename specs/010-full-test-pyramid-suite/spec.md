# Feature Specification: Full Test Pyramid Suite (Unit, Integration & E2E)

**Feature Branch**: `010-full-test-pyramid-suite`  
**Created**: 2026-11-21  
**Status**: Draft  
**Input**: User description: "hãy build toàn bộ unit test, integration test, e2e test cho repo này"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprehensive Unit Test Suite for Domain Logic & RBAC (Priority: P1)

As a developer or maintainer working on domain features, I want a fast, deterministic unit test suite covering RBAC permissions, data generators, timeline builders, and schema validators, so that I can immediately detect regressions in business rules without starting servers or connecting to external databases.

**Why this priority**: Business logic and security partitioning are the bedrock of system integrity. Unit tests provide instantaneous feedback (sub-second execution) and catch regressions at the source.

**Independent Test**: Can be executed independently via `npm run test:unit` in < 3 seconds, delivering immediate validation of pure functions and domain algorithms.

**Acceptance Scenarios**:
1. **Given** unauthenticated or unauthorized roles, **When** evaluating route access through `canAccessRoute` or `hasRole`, **Then** content admin routes are strictly denied to regular members and unauthenticated visitors.
2. **Given** user input names with Vietnamese diacritics and special characters, **When** executing username generation and slugification utilities, **Then** accents are stripped cleanly and collisions are resolved predictably.
3. **Given** a collection of raw events spanning past and future timestamps, **When** computing event timelines, **Then** past and upcoming events are partitioned and tagged with correct ID prefixes (`post-`, `pe-`).
4. **Given** payload inputs for blog posts, event submissions, or member portfolio updates, **When** passing through domain schema validators, **Then** valid payloads pass cleanly and malformed payloads produce specific validation errors.

---

### User Story 2 - Integration Test Suite for Route Handlers & Server Actions (Priority: P2)

As a developer modifying API endpoints or server-side workflows, I want automated integration tests for Next.js App Router route handlers (`/api/auth/me`, `/api/auth/logout`, `/api/blogs`, `/api/projects`) and admin server actions, so that I can verify HTTP response codes, headers, cookie lifecycles, and payload contracts.

**Why this priority**: API routes and Server Actions represent the communication boundary between frontend presentation and backend persistence. Integration tests verify contract safety and session lifecycle handling.

**Independent Test**: Can be executed via `npm run test:integration` against isolated route handler modules using mocked request/response contexts without a live production backend.

**Acceptance Scenarios**:
1. **Given** a request to `/api/auth/me` with a valid mock session, **When** the route handler executes, **Then** it returns HTTP 200 with user profile and role details.
2. **Given** a request to `/api/auth/me` without session cookies, **When** the route handler executes, **Then** it returns HTTP 401 Unauthorized with proper error status.
3. **Given** a POST request to `/api/auth/logout`, **When** the handler executes, **Then** it clears session cookies and returns HTTP 200 OK.
4. **Given** requests to public read endpoints (`/api/blogs`, `/api/projects`), **When** optional query filters and pagination are passed, **Then** filtered list structures and metadata are returned correctly.
5. **Given** an unprivileged user attempting to trigger admin Server Actions, **When** the action is called, **Then** the action rejects the mutation and returns an authorization failure.

---

### User Story 3 - End-to-End (E2E) Browser Journey & RBAC Smoke Testing (Priority: P3)

As a release engineer or quality assurance auditor, I want an automated end-to-end browser test suite running in a real browser environment, so that I can verify that critical public visitor journeys and partitioned administrative workflows function seamlessly from the user's perspective.

**Why this priority**: E2E tests provide the ultimate confirmation that all integrated layers (Next.js server, React components, client hydration, routing, and styling) render and function properly without broken layouts or uncaught runtime exceptions.

**Independent Test**: Can be executed via `npm run test:e2e` spinning up Playwright against a local Next.js build, validating browser rendering and navigation flows.

**Acceptance Scenarios**:
1. **Given** a visitor loading the public home page, **When** navigating through Header navigation (Home -> Blog -> Post Details -> Events -> Projects), **Then** each page renders successfully with proper titles, content sections, and zero client-side exceptions.
2. **Given** an unauthenticated visitor navigating directly to `/admin` or `/admin/blogs`, **When** the page loads, **Then** the application redirects the user to `/admin/login`.
3. **Given** an authenticated user with a `Member` role, **When** navigating to `/admin`, **Then** the application routes them exclusively to `/admin/portfolio` and forbids access to `/admin/blogs` or `/admin/users`.
4. **Given** an administrator logged in with `Content` or `Admin` privileges, **When** accessing `/admin/blogs`, **Then** the blog management console displays and allows creating or editing posts.

---

### Edge Cases

- How does the system handle network timeouts or abort signals during API route integrations?
- How does the E2E test harness prevent test flakiness caused by asynchronous client hydration or animation transitions?
- How are test databases or dev data protected from pollution during E2E test runs? (Resolved: Read-only flows query actual dev DB data; mutation tests use explicit `[E2E-TEST]` prefix with automated teardown cleanup in `afterAll`).
- What happens when a user attempts to generate usernames with non-standard unicode symbols, emoji characters, or extremely long strings?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST provide dedicated npm scripts: `npm run test` (running unit + integration tests for quick feedback), `npm run test:unit`, `npm run test:integration`, `npm run test:e2e` (Playwright suite), and `npm run test:all` (full pyramid execution).
- **FR-002**: Unit tests MUST execute purely in memory with zero external network or database dependencies, completing in under 5 seconds.
- **FR-003**: Integration tests MUST validate Next.js route handlers (`app/api/*`) for status codes, headers, cookie mutation, and response JSON contracts.
- **FR-004**: Integration tests MUST validate Server Actions (`actions.ts`) for authentication enforcement and permission rejection.
- **FR-005**: E2E test suite MUST utilize Playwright (`@playwright/test`) configured with multi-browser support (Chromium, Firefox, WebKit) and responsive viewport configurations against the local development server and database.
- **FR-006**: E2E tests MUST assert key user journeys: public content browsing, responsive mobile navigation toggle, unauthenticated redirect to `/admin/login`, and RBAC partitioning between Content and Member zones.
- **FR-007**: All test suites MUST emit structured terminal reports and return exit code 0 on success and non-zero on assertion failure.
- **FR-008**: Test implementations MUST maintain strict TypeScript type compliance (`npx tsc --noEmit` exits with code 0) and zero ESLint violations.

### Key Entities *(include if feature involves data)*

- **Test Suite**: A cohesive collection of test specifications verifying a specific layer (Unit, Integration, E2E) or functional domain.
- **Test Runner & Harness**: The execution engine driving tests (`tsx --test` for fast native unit/integration tests; Playwright runner for browser E2E).
- **Test Fixture & Mock Context**: Deterministic, pre-configured input payloads, headers, cookies, and mock responses simulating real-world system states.
- **Quality Gate / Threshold**: Objective pass/fail criteria required before a branch or deployment is considered production-ready.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of core domain utility functions (RBAC checks, username generator, event timeline, slugification, schema validation) have dedicated automated unit tests.
- **SC-002**: Core API route handlers (`/api/auth/me`, `/api/auth/logout`, `/api/blogs`, `/api/projects`) have automated integration tests verifying both positive and negative authorization flows.
- **SC-003**: Critical user journeys (Public exploration, unauthenticated login redirect, member portfolio partitioning, and content admin navigation) are verified via Playwright E2E tests.
- **SC-004**: Unit test suite executes locally in under 5 seconds.
- **SC-005**: All test additions maintain 100% build health with 0 TypeScript compiler errors and 0 ESLint warnings.

## Assumptions

- Unit and Integration tests will leverage the native Node.js test runner via `tsx --test` to provide maximum execution speed without heavyweight framework overhead.
- E2E tests will use `@playwright/test` running against a local Next.js server instance (`next dev` or `next start`) connected to the local development database (`.env.local`).
- E2E tests querying public pages will assert against real development database records, while any creation/mutation tests will clean up after themselves using deterministic teardown.
- Mocking for integration tests will be achieved cleanly using standard Request/Response objects conforming to the Next.js App Router specifications.
- E2E tests will run in headless mode for automated environments and support headed mode for local developer debugging.
