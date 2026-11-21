<!--
Sync Impact Report:
- Version change: [CONSTITUTION_VERSION] (uninitialized template) -> 1.0.0
- List of modified principles:
  * [PRINCIPLE_1_NAME] -> I. Architecture & Separation of Concerns (Full-Stack Decoupled)
  * [PRINCIPLE_2_NAME] -> II. RBAC & Identity-First Security (Single Source of Truth)
  * [PRINCIPLE_3_NAME] -> III. Clean Code & Modern Standards (Vercel & Clean Code)
  * [PRINCIPLE_4_NAME] -> IV. Verification, Testing & Quality Gates
  * [PRINCIPLE_5_NAME] -> V. Resilience, Observability & Performance
- Added sections:
  * Additional Constraints & Security Requirements
  * Development Workflow & Quality Gates
- Removed sections: None
- Follow-up TODOs: None
-->

# DUT-AI Web Constitution

## Core Principles

### I. Architecture & Separation of Concerns (Full-Stack Decoupled)
- The system MUST adhere to a clean decoupled architecture: **Next.js (React)** for presentation & user experience, and **Wagtail CMS (Django) / Python API** for headless backend & content management.
- Backend services MUST expose stateless, structured REST/GraphQL APIs. Database operations MUST remain encapsulated within backend service layers.
- Frontend MUST consume backend endpoints through typed API wrappers and handle optimistic updates, errors, and fallbacks gracefully without exposing backend internals.

### II. RBAC & Identity-First Security (Single Source of Truth)
- Authentication and authorization MUST rely strictly on the authoritative Identity Provider (IdP) and centralized session management (`/api/v1/auth/me`). Local unverified decoding of JWT signatures without keys for privilege determination is STRICTLY FORBIDDEN.
- Role-based Access Control (RBAC) MUST enforce strict zoning:
  - **Content Zone**: Routes under `/admin` (except member portfolio) are restricted to accounts holding the `Content` (or `Admin`) role.
  - **Member Profile Zone**: Non-content members MUST be partitioned strictly to their personal portfolio (`/admin/portfolio`).
- Both Server-Side guards (Next.js middleware / server actions / backend views) and Client-Side UI guards MUST enforce permissions defense-in-depth.

### III. Clean Code & Modern Standards (Pragmatic & Maintainable)
- All code MUST adhere to clean code principles: concise, direct, self-documenting, and free from speculative over-engineering (YAGNI).
- Modern web engineering guidelines MUST be respected:
  - Adhere to React Server/Client Component boundaries to minimize client bundle footprints.
  - Comply with Core Web Vitals standards (LCP, INP, CLS) and modern semantic accessibility (a11y).
  - TypeScript types MUST be strictly defined and validated at runtime boundaries where user input enters the system.

### IV. Verification, Testing & Quality Gates (NON-NEGOTIABLE)
- Code changes MUST be accompanied by verification: unit tests for business logic, contract tests for APIs, and end-to-end smoke checks for critical user authentication and partitioned workflows.
- No task is complete until automated quality gates (`tsc --noEmit`, linters, formatters, and static checks) succeed cleanly with zero critical regressions.
- Socratic Gate protocol: Ambiguous specifications or breaking edge cases MUST be surfaced, clarified, and resolved before irreversible architectural changes are committed.

### V. Resilience, Observability & Performance
- All asynchronous calls and external network interactions MUST enforce explicit timeouts (e.g., `AbortSignal.timeout`) and deterministic error boundaries to prevent infinite blocking or unhandled UI freezes.
- State transitions, route navigations, and session mutations (Login, Logout, Role Switch) MUST execute with clear visual feedback, deterministic client cache invalidation, and seamless fallback routing.

## Additional Constraints & Security Requirements

- **Secret & Credential Management**: No private keys, service credentials, or production tokens may be committed to version control. Environment configurations (`.env.local`, `.env`) MUST use strict validation patterns.
- **Session Lifecycle**: Logout MUST deterministically invalidate local cookies/session state across all endpoints (`/api/auth/logout`, `SsoAuthContext`, `actions.ts`) and navigate to the dedicated login route (`/admin/login`).
- **UI/UX Guidelines**: Avoid generic clichés. Maintain cohesive design tokens and user feedback patterns across admin consoles and public portals.

## Development Workflow & Quality Gates

- **Pre-Commit Verification**: Run type checking (`tsc --noEmit`), code style formatting (Prettier), and linting (ESLint) before merging or finalizing any feature.
- **Spec-Kit Workflow**: Features follow structured lifecycle stages: Specification (`/speckit-specify`), Architecture & Planning (`/speckit-plan`), Task Breakdown (`/speckit-tasks`), and Implementation (`/speckit-implement`).
- **Review & Audit**: High-impact security and permission modifications require automated regression analysis and explicit architectural sign-off.

## Governance

- The **DUT-AI Web Constitution** supersedes ad-hoc implementation habits and establishes the foundational technical law for the repository.
- Amendments to this constitution must be documented, versioned semantically, and approved by project maintainers.
- Versioning Policy:
  - **MAJOR**: Incompatible governance shifts, architectural paradigms, or principle deprecations.
  - **MINOR**: Addition of new principles, significant expansion of development standards or security requirements.
  - **PATCH**: Non-semantic refinements, typographical fixes, and clarification updates.

**Version**: 1.0.0 | **Ratified**: 2026-11-21 | **Last Amended**: 2026-11-21
