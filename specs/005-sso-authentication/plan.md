# Implementation Plan: DUT-AI Ecosystem Single Sign-On (SSO) Integration

**Branch**: `005-sso-authentication` | **Date**: 2026-11-20 | **Spec**: [specs/005-sso-authentication/spec.md](file:///Users/nguyenhuynh/Documents/projects/dut-ai-web/specs/005-sso-authentication/spec.md)

**Input**: Feature specification from `specs/005-sso-authentication/spec.md`

## Summary

Integrate DUT-AI's centralized True Single Sign-On (SSO) architecture into `dut-ai-web` to deliver frictionless, cross-subdomain authentication across `*.dutai.io.vn`. The implementation includes:
1. An edge-compatible Next.js Middleware (`frontend/middleware.ts`) that guards protected routes (`/admin/*`), validates JWT token expiration instantly, and redirects unauthenticated users to the central login portal (`https://workspace.dutai.io.vn/login?redirect=...`) while keeping public marketing routes freely accessible.
2. A shared SSO library (`frontend/lib/auth-sso.ts`) and API proxy (`frontend/app/api/auth/me/route.ts`) to fetch, decode, and cache user profiles (`id`, `name`, `email`, `avatar_url`, `role_names`, `permissions`) from the central IdP (`https://manage.dutai.io.vn/api/v1/auth/me`).
3. Single Sign-Out endpoint (`frontend/app/api/auth/logout/route.ts`) to invalidate shared cookies across the `.dutai.io.vn` root domain with proper RFC security attributes.
4. A React context provider (`frontend/context/SsoAuthContext.tsx`) and UI components in the global `Header` and `admin/layout` to dynamically render user status, avatar, and RBAC-driven menus.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js 20+

**Primary Dependencies**: Next.js 16.3.1 (App Router), React 19.2.4, Tailwind CSS 4.1.18, `lucide-react`, native Web Fetch & Edge Cookie APIs

**Storage**: Browser Cookies (Domain: `.dutai.io.vn`, `access_token`, `refresh_token`), in-memory React Request Cache during SSR

**Testing**: Unit tests, TypeScript compilation (`tsc --noEmit`), Next.js build (`npm run build`), ESLint (`npm run lint`), manual edge redirect & cookie clearing verification

**Target Platform**: Edge & Node.js server runtimes, Modern Web Browsers (Chrome, Safari, Firefox, Edge)

**Project Type**: Web Application (Next.js 16 App Router)

**Performance Goals**:
- Edge middleware token check < 2ms (no blocking network calls).
- Redirection to central login portal < 100ms.
- Current user profile retrieval < 1.0s on initial load; instant subsequent access via client state.
- Zero layout shift (CLS < 0.05) in navigation header between guest and authenticated states.

**Constraints**:
- Strictly follow DUT-AI brand guidelines: dark/light theme tokens, no unapproved colors.
- Maintain seamless public access for search engine crawlers and guest visitors (no blanket site redirects).
- Support local development without requiring live `.dutai.io.vn` browser cookie sharing.
- Strict TypeScript with zero `any` types.

**Scale/Scope**: All visitors to `dutai.io.vn`, ~100+ active club members/admins, unlimited monthly page views.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Compliance Status | Analysis & Evidence |
| :--- | :--- | :--- |
| **I. Clean Code & Simplicity** | PASS | Reuses existing native Next.js middleware and cookie APIs without introducing heavy external auth libraries or custom servers. |
| **II. Technology-Agnostic Spec** | PASS | `spec.md` focuses strictly on user journeys, access requirements, and measurable outcomes. |
| **III. Testable Slices (MVP first)** | PASS | Prioritized slices: P1 (Cross-subdomain SSO access & Route guard) -> P2 (RBAC profile context & Single Logout) -> P3 (Public page header awareness). |
| **IV. Security & Cookie Safety** | PASS | Shared tokens use `HttpOnly`, `SameSite=Lax`, and `Secure` flags; token expiration is verified at the Edge; logout completely revokes root domain cookies. |
| **V. Developer Experience & Local Dev** | PASS | Dynamic cookie domain fallback prevents localhost cookie rejection and ensures developers can test offline. |

## Project Structure

### Documentation (this feature)

```text
specs/005-sso-authentication/
├── spec.md                  # Feature Specification
├── plan.md                  # This implementation plan
├── research.md              # Phase 0: Technical choices, architectural research & decisions
├── data-model.md            # Phase 1: Entities, JWT claims & route protection rules
├── quickstart.md            # Phase 1: Verification, test steps, and local reproduction guide
├── checklists/
│   └── requirements.md      # Spec Quality Checklist
└── contracts/               # Phase 1: Interface & API contracts
    ├── sso-api.md           # IdP & Next.js API endpoints contracts
    └── auth-context-contract.md # React Context & Client interfaces
```

### Source Code (repository root)

```text
frontend/
├── middleware.ts            # Authentication Guard: Intercepts protected routes, decodes JWT exp, redirects to portal
├── lib/
│   ├── auth-sso.ts          # SSO client/server helpers: fetchCurrentSsoUser, decodeJwtPayload, cookie options
│   └── admin-auth.ts        # Updated to integrate with SSO tokens and profile structure
├── context/
│   └── SsoAuthContext.tsx   # React Context providing user, isAuthenticated, roles, permissions, logout
├── app/
│   ├── layout.tsx           # Wraps application in SsoAuthProvider
│   ├── api/
│   │   └── auth/
│   │       ├── me/
│   │       │   └── route.ts # Proxy GET /api/auth/me to https://manage.dutai.io.vn/api/v1/auth/me
│   │       └── logout/
│   │           └── route.ts # POST /api/auth/logout clearing shared .dutai.io.vn cookies
│   └── admin/
│       ├── layout.tsx       # Updated to read SSO user profile and permissions from SsoAuthContext
│       └── login/
│           └── page.tsx     # Redirects to workspace portal or provides SSO login trigger
└── components/
    ├── Header.tsx           # Global header updated with dynamic user avatar dropdown or "Đăng nhập" button
    └── auth/
        └── UserMenuDropdown.tsx # Dropdown component for authenticated user in Header
```
