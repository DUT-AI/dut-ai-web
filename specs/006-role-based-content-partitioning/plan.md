# Implementation Plan: Role-Based Content & Member Partitioning

**Branch**: `006-role-based-content-partitioning` | **Date**: 2026-11-21 | **Spec**: [specs/006-role-based-content-partitioning/spec.md](file:///Users/nguyenhuynh/Documents/projects/dut-ai-web/specs/006-role-based-content-partitioning/spec.md)

**Input**: Feature specification from `specs/006-role-based-content-partitioning/spec.md`

## Summary

Implement Role-Based Access Control (RBAC) partitioning across the administrative workspace of `dut-ai-web`:
1. **Quản lý nội dung (Content Management Zone)**: Covers Dashboard Overview (`/admin`), Blogs (`/admin/blogs`), Projects (`/admin/projects`), Events (`/admin/events`), Moments (`/admin/posts`), Generations (`/admin/generations`), SEO Keywords (`/admin/keywords`), and Introductions (`/admin/introductions`). Access is strictly granted only to users whose `role_names` includes `"Content"` (or `"admin"`).
2. **Thông tin thành viên (Member Information Zone)**: Covers exclusively Personal Portfolio (`/admin/portfolio`), available to all authenticated members (and Content creators).
3. **Multi-Layer Guarding & Adaptive UI**:
   - Edge Middleware (`frontend/middleware.ts`) and Admin Layout (`frontend/app/admin/layout.tsx`) intercept non-Content users attempting to access Content routes, redirecting them smoothly to `/admin/portfolio?denied=content` with toast feedback.
   - Server Actions enforce `requireContentSession()` before mutating any content assets.
   - Admin sidebar and user account dropdown adapt dynamically to display only authorized partitions.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js 20+

**Primary Dependencies**: Next.js 16.3.1 (App Router), React 19.2.4, Tailwind CSS 4.1.18, `lucide-react`, `sonner`

**Storage**: PostgreSQL (via Drizzle ORM) for content & portfolio entities; shared SSO cookies (`.dutai.io.vn`) for session credentials

**Testing**: TypeScript compilation (`tsc --noEmit`), Next.js production build (`npm run build`), ESLint (`npm run lint`), manual edge redirect & role verification

**Target Platform**: Edge & Node.js server runtimes, Modern Web Browsers

**Project Type**: Web Application (Next.js 16 App Router)

**Performance Goals**:
- Edge middleware role evaluation < 2ms (zero external network latency).
- Immediate redirection to `/admin/portfolio` for unauthorized content route visits (< 100ms).
- Zero flash of unauthorized navigation links in sidebar or header dropdown.

**Constraints**:
- Case-insensitive role comparison (`'content'` or `'admin'`).
- Backward compatibility: `"admin"` role retains overarching operational access.
- Non-Content users must never reach a 404 or blank screen when accessing `/admin`; they must land gracefully at `/admin/portfolio`.
- Zero `any` types in TypeScript code.

**Scale/Scope**: All active DUT-AI members and content editors accessing `/admin/*`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Compliance Status | Analysis & Evidence |
| :--- | :--- | :--- |
| **I. Clean Code & Simplicity** | PASS | Reuses existing `SsoAuthContext`, JWT decoder, and Next.js middleware without introducing external RBAC frameworks. |
| **II. Technology-Agnostic Spec** | PASS | `spec.md` focuses strictly on user journeys, access requirements, and measurable outcomes. |
| **III. Testable Slices (MVP first)** | PASS | Prioritized slices: P1 (Content role access & Member portfolio isolation) -> P2 (Server action guard & Adaptive navigation) -> P3 (Self-portfolio for Content staff). |
| **IV. Security & Role Safety** | PASS | Defense-in-depth across Edge Middleware, Client Layout Guard, and Server Action validation preventing any privilege escalation. |
| **V. Usability & Graceful Fallback** | PASS | Non-Content users are redirected smoothly to `/admin/portfolio` with explanatory feedback rather than abrupt HTTP 403 blocks. |

## Project Structure

### Documentation (this feature)

```text
specs/006-role-based-content-partitioning/
├── spec.md                  # Feature Specification
├── plan.md                  # This implementation plan
├── research.md              # Phase 0: Technical choices, architectural research & decisions
├── data-model.md            # Phase 1: Entities, roles, partition mappings & access matrix
├── quickstart.md            # Phase 1: Verification, test scenarios & verification guide
├── checklists/
│   └── requirements.md      # Spec Quality Checklist
└── contracts/               # Phase 1: Interface & Route Guard contracts
    ├── rbac-partitioning.md # Helper signatures, contracts & action error types
    └── route-guards.md      # Middleware URL patterns & Navigation contracts
```

### Source Code (repository root)

```text
frontend/
├── lib/
│   ├── enums/
│   │   └── roles.ts         # Added UserRole.CONTENT, hasContentAccess() helper
│   ├── admin-auth.ts        # Added requireContentSession() server action guard
│   └── auth-sso.ts          # Updated type definitions if needed
├── context/
│   └── SsoAuthContext.tsx   # Added isContentManager convenience flag
├── middleware.ts            # Added Content Zone route interception & redirect to /admin/portfolio
├── components/
│   └── auth/
│       └── UserMenuDropdown.tsx # Dynamic link: Content users see Admin, others see Portfolio
└── app/
    └── admin/
        ├── layout.tsx       # Sidebar partitioned into "QUẢN LÝ NỘI DUNG" & "THÔNG TIN THÀNH VIÊN"
        └── [blogs|projects|events|posts|generations|keywords|introductions]/
            └── actions.ts   # Server actions secured with requireContentSession()
```
