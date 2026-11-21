# Implementation Plan: Full Test Pyramid Suite (Unit, Integration & E2E)

**Branch**: `010-full-test-pyramid-suite` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

## Summary

Implement a full three-tier testing pyramid for DUT-AI Web:
1. **Unit Testing Tier**: High-speed, isolated unit tests using native `tsx --test` covering RBAC logic, username/slug generators, event timeline grouping, date utilities, and Zod input validators.
2. **Integration Testing Tier**: Route Handler (`app/api/*`) and Server Action tests using `tsx --test` with Next.js standard Web `Request`/`Response` mocking to verify status codes, authorization gates, and payload contracts.
3. **End-to-End (E2E) Testing Tier**: Browser automation suite using Playwright (`@playwright/test`) running against the local Next.js dev server and development database (`.env.local`), verifying public navigation, responsive views, unauthenticated `/admin/login` redirection, and strict Content vs. Member RBAC zoning.
4. **Unified NPM Scripts**: Configure `npm run test` (unit + integration), `npm run test:unit`, `npm run test:integration`, `npm run test:e2e`, and `npm run test:all`.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v20+, Next.js 16 (App Router), React 19  
**Test Frameworks**:
- **Unit & Integration**: Node.js native test runner (`node:test`, `node:assert/strict`) via `tsx --test`
- **E2E**: Playwright (`@playwright/test`)
**Database**: PostgreSQL / Drizzle ORM (read-only verification against existing dev DB; mutation tests use `[E2E-TEST]` prefix and automated teardown)  
**Authentication in Tests**:
- Integration: Mock Request headers / Next.js cookies store
- E2E: Playwright cookie injection for session state simulation (Content vs Member roles)

## Constitution Check

- **Principle I: Architecture & Separation of Concerns**: PASSED. Clear physical boundary between Unit (logic), Integration (API boundaries), and E2E (browser UI journeys).
- **Principle II: RBAC & Identity-First Security**: PASSED. Multi-layered verification ensuring that unauthenticated users are redirected to `/admin/login` and non-content members are partitioned strictly to `/admin/portfolio`.
- **Principle III: Clean Code & Modern Standards**: PASSED. Uses standard Web APIs (`Request`, `Response`) for route testing and official Playwright best practices without brittle selector paths.
- **Principle IV: Verification, Testing & Quality Gates**: PASSED. Directly fulfills Principle IV by establishing automated, repeatable test suites with exit code 0 enforcement.
- **Principle V: Resilience, Observability & Performance**: PASSED. Unit tests execute in < 3s; E2E tests have explicit timeouts and zero database contamination.

## Project Structure

### Documentation (`specs/010-full-test-pyramid-suite/`)

```text
specs/010-full-test-pyramid-suite/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research & technology selection
├── data-model.md        # Phase 1 test architecture & models
├── quickstart.md        # Phase 1 developer guide for running tests
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── contracts/
    └── test-matrix.md   # Feature and route testing matrix
```

### Source Code (`frontend/`)

```text
frontend/
├── package.json                   # Test scripts & @playwright/test dependency
├── playwright.config.ts           # Playwright multi-browser & webServer configuration
├── tests/
│   ├── unit/                      # P1: Pure functions, domain utilities, RBAC matrix
│   │   ├── rbac-partitioning.test.ts
│   │   ├── username-generator.test.ts
│   │   ├── events-timeline.test.ts
│   │   ├── vietnamese-names.test.ts
│   │   ├── thumbnail-generator.test.ts
│   │   ├── blog-validators.test.ts
│   │   └── date-formatting.test.ts
│   ├── integration/               # P2: Next.js Route Handlers & Server Actions
│   │   ├── helpers/
│   │   │   └── mock-request.ts    # Request factory & mock cookies
│   │   ├── auth-me-route.test.ts
│   │   ├── auth-logout-route.test.ts
│   │   ├── blogs-route.test.ts
│   │   └── projects-route.test.ts
│   └── e2e/                       # P3: Browser automation & user flows
│       ├── fixtures/
│       │   └── auth.fixture.ts    # Session cookies for Member & Content roles
│       ├── public-navigation.spec.ts
│       ├── rbac-guard.spec.ts
│       └── admin-smoke.spec.ts
```

## Planned Execution Steps

### Phase 1: Unit Test Suite Expansion
1. Audit pure utility functions and domain models across `features/` and `lib/`.
2. Add unit tests for blog validators, date formatting, and markdown excerpt extraction.
3. Verify all unit tests pass cleanly via `tsx --test tests/unit/*.test.ts`.

### Phase 2: Integration Test Suite (Route Handlers & Server Actions)
1. Create `tests/integration/helpers/mock-request.ts` to construct mock `NextRequest` and Web `Request` objects with headers and query params.
2. Implement integration tests for `/api/auth/me` (positive with mock session, negative with 401).
3. Implement integration tests for `/api/auth/logout` (verifying cookie clearing).
4. Implement integration tests for `/api/blogs` and `/api/projects` (verifying response shapes and pagination).
5. Verify integration tests pass via `tsx --test tests/integration/*.test.ts`.

### Phase 3: Playwright E2E Setup & Test Cases
1. Install `@playwright/test` as a devDependency in `frontend/`.
2. Create `frontend/playwright.config.ts` configuring Chromium, Firefox, WebKit, and local server integration.
3. Create `tests/e2e/fixtures/auth.fixture.ts` for injecting mock auth cookies (Content Admin vs Member).
4. Implement `tests/e2e/public-navigation.spec.ts` (Homepage, Blogs, Detail, Events, Projects, Mobile nav).
5. Implement `tests/e2e/rbac-guard.spec.ts` (Login redirect, Content access, Member portfolio isolation).
6. Implement `tests/e2e/admin-smoke.spec.ts` (Admin console views and cleanup).

### Phase 4: Root NPM Scripts & Quality Verification
1. Update `package.json` scripts: `"test"`, `"test:unit"`, `"test:integration"`, `"test:e2e"`, `"test:all"`.
2. Verify all test suites pass with exit code 0.
3. Run `npx tsc --noEmit` and `npm run build` to ensure 100% build health with 0 regressions.
