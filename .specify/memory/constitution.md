<!--
Sync Impact Report:
- Version change: 1.0.0 -> 1.1.0
- List of modified principles:
  * Principle I: Architecture & Separation of Concerns (Full-Stack Decoupled) -> Expanded with Vertical Slice Architecture (Feature-Driven DB Colocation)
  * Principle III: Clean Code & Modern Standards -> Codified React 19 rules (Image Optimization & anti-pattern bans)
  * Principle IV: Verification, Testing & Quality Gates -> Formally codified Full Test Pyramid (Unit, Integration, Playwright E2E) and Dev DB teardown safety
- Added sections/rules:
  * Vertical Slice Colocation: Each domain in `features/<domain>/` owns its UI, logic, and database layer (`db/`)
  * Three-Tier Test Pyramid standards: `test:unit`, `test:integration`, `test:e2e`, and `[E2E-TEST]` isolation
  * React 19 Next.js `<Image />` mandate (no raw <img> in views or admin consoles)
- Removed sections: None
- Follow-up TODOs: None
-->

# DUT-AI Web Constitution

## Core Principles

### I. Architecture & Separation of Concerns (Vertical Slice & Decoupled)
- The system MUST adhere to a clean decoupled architecture: **Next.js (React)** for presentation & user experience, and **Wagtail CMS (Django) / Python API** for headless backend & content management.
- **Vertical Slice Colocation (Feature-Driven)**: Domain modules under `frontend/features/<domain>/` MUST encapsulate their own UI components, hooks, domain types, and data persistence layers (`db/schema.ts`, `db/queries.ts`, `db/types.ts`). Central registries (such as `lib/db/schema.ts` and `lib/db/queries.ts`) act strictly as aggregators/re-exporters for Drizzle Kit and shared callers.
- Backend services MUST expose stateless, structured REST/GraphQL APIs. Database operations outside of direct Next.js domain features MUST remain encapsulated within backend service layers.
- Frontend MUST consume backend endpoints through typed API wrappers and handle optimistic updates, errors, and fallbacks gracefully without exposing backend internals.

### II. RBAC & Identity-First Security (Single Source of Truth)
- Authentication and authorization MUST rely strictly on the authoritative Identity Provider (IdP) and centralized session management (`/api/v1/auth/me`). Local unverified decoding of JWT signatures without keys for privilege determination is STRICTLY FORBIDDEN.
- Role-based Access Control (RBAC) MUST enforce strict zoning:
  - **Content Zone**: Routes under `/admin` (except member portfolio) are restricted to accounts holding the `Content` (or `Admin`) role.
  - **Member Profile Zone**: Non-content members MUST be partitioned strictly to their personal portfolio (`/admin/portfolio`).
- Both Server-Side guards (Next.js middleware / server actions / backend views) and Client-Side UI guards MUST enforce permissions defense-in-depth.

### III. Clean Code & Modern Standards (Vercel & Clean Code)
- All code MUST adhere to clean code principles: concise, direct, self-documenting, and free from speculative over-engineering (YAGNI).
- Modern web engineering guidelines MUST be respected:
  - **React 19 & Next.js `<Image />` Mandate**: Raw `<img>` tags are STRICTLY FORBIDDEN for application media and content. Next.js `<Image />` MUST be utilized across public views and admin management consoles to guarantee Core Web Vitals (LCP, CLS) optimization.
  - **Hook Integrity**: Conditional hook calls inside branching logic (`if`, loops) are STRICTLY FORBIDDEN. Hydration mismatches and cascading re-renders MUST be resolved via `useSyncExternalStore` or deterministic client-side mounting gates (`useIsMounted`).
  - Adhere strictly to React Server/Client Component boundaries to minimize client bundle footprints.
  - TypeScript types MUST be strictly defined and validated at runtime boundaries where user input enters the system.

### IV. Verification, Testing & Quality Gates (NON-NEGOTIABLE)
- **Full Test Pyramid Enforcement**: Every domain feature MUST be backed by automated test coverage:
  - **Unit Tier (`npm run test:unit`)**: Fast (< 3s), deterministic tests covering pure logic, RBAC matrix (`canAccessRoute`, `hasRole`), generators, formatters, and Zod schema validators.
  - **Integration Tier (`npm run test:integration`)**: Next.js App Router route handlers (`app/api/*`) and Server Actions verified with mock requests and session lifecycle checks.
  - **E2E Tier (`npm run test:e2e`)**: Multi-browser Playwright automation verifying critical public visitor journeys, responsive viewports, and RBAC zone partitioning.
- **Development Database Teardown Safety**: When E2E tests run against the development database, any test mutations MUST use an explicit `[E2E-TEST]` prefix and execute deterministic teardown cleanups in `afterAll()` hooks to guarantee zero dev data pollution.
- No task is complete until automated quality gates (`tsc --noEmit`, linters, formatters, and automated tests) succeed cleanly with zero critical regressions.
- **Socratic Gate Protocol**: Ambiguous specifications or breaking edge cases MUST be surfaced, clarified, and resolved before irreversible architectural changes are committed.

### V. Resilience, Observability & Performance
- All asynchronous calls and external network interactions MUST enforce explicit timeouts (e.g., `AbortSignal.timeout`) and deterministic error boundaries to prevent infinite blocking or unhandled UI freezes.
- State transitions, route navigations, and session mutations (Login, Logout, Role Switch) MUST execute with clear visual feedback, deterministic client cache invalidation, and seamless fallback routing.
- External Web Components (e.g. DutaiWaffle) MUST include local defensive fallbacks and Shadow DOM style encapsulation so that remote network latencies or missing assets never degrade the core application user experience.

## Additional Constraints & Security Requirements

- **Secret & Credential Management**: No private keys, service credentials, or production tokens may be committed to version control. Environment configurations (`.env.local`, `.env`) MUST use strict validation patterns.
- **Session Lifecycle**: Logout MUST deterministically invalidate local cookies/session state across all endpoints (`/api/auth/logout`, `SsoAuthContext`, `actions.ts`) and navigate to the dedicated login route (`/admin/login`).
- **UI/UX Guidelines**: Avoid generic clichés. Maintain cohesive design tokens, responsive layouts, and accessible feedback patterns across admin consoles and public portals.

## Development Workflow & Quality Gates

- **Pre-Commit Verification**: Run type checking (`tsc --noEmit`), code style formatting (Prettier), linting (ESLint), and automated tests (`npm run test`) before merging or finalizing any feature.
- **Spec-Kit Workflow**: Features follow structured lifecycle stages: Specification (`/speckit-specify`), Architecture & Planning (`/speckit-plan`), Task Breakdown (`/speckit-tasks`), and Implementation (`/speckit-implement`).
- **Review & Audit**: High-impact security and permission modifications require automated regression analysis and explicit architectural sign-off.

## Governance

- The **DUT-AI Web Constitution** supersedes ad-hoc implementation habits and establishes the foundational technical law for the repository.
- Amendments to this constitution must be documented, versioned semantically, and approved by project maintainers.
- Versioning Policy:
  - **MAJOR**: Incompatible governance shifts, architectural paradigms, or principle deprecations.
  - **MINOR**: Addition of new principles, significant expansion of development standards or security requirements.
  - **PATCH**: Non-semantic refinements, typographical fixes, and clarification updates.

**Version**: 1.1.0 | **Ratified**: 2026-11-21 | **Last Amended**: 2026-11-21
