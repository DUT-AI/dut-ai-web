# Feature Specification: Feature-Driven / Modular Architecture Refactoring

**Feature Branch**: `007-feature-driven-architecture`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "Tôi muốn refactor lại dự án theo mô hình Mô hình B: Feature-Driven / Modular Architecture (Chuẩn Enterprise & Scalable lớn) + theo ý kiến của bạn"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintain and Scale Features Autonomously (Priority: P1)

As a full-stack developer or code maintainer, I want all domain-specific assets (components, data models, logic, and actions) of a specific feature (such as Blog, Portfolio, Events, About, or Authentication) encapsulated inside a dedicated feature module (`features/<domain>/`), so that I can easily discover, develop, test, and scale that domain without navigating scattered global directories or triggering unintended cross-feature side effects.

**Why this priority**: Modularity and bounded domain contexts are the primary reason for adopting an Enterprise Feature-Driven Architecture. It directly prevents monolithic coupling and speeds up future development.

**Independent Test**: Can be verified by picking a single domain module (e.g., `features/blog` or `features/portfolio`) and confirming that all domain-specific components, actions, queries, and type definitions reside in that module, with zero regressions on existing functional flows.

**Acceptance Scenarios**:

1. **Given** a developer working on the Member Portfolio domain, **When** they navigate to `frontend/features/portfolio/`, **Then** they find all portfolio-related components, queries, actions, and utilities in one unified folder hierarchy.
2. **Given** an existing public or admin user journey (viewing blogs, editing portfolio, logging in), **When** performing everyday actions, **Then** the application behaves identically with zero functional or visual regressions.

---

### User Story 2 - Clean and Discoverable Shared Components (Priority: P2)

As a front-end developer, I want global/shared UI components to be organized logically under `components/` (specifically separating atomic design elements in `components/ui/`, app-wide shell components in `components/layout/`, and common utilities in `components/common/`), so that reusable design primitives are clearly distinguished from page-specific or domain-specific views.

**Why this priority**: Eliminates root-level clutter in `components/` where more than 20 disparate files were mixed together without clear ownership.

**Independent Test**: Can be verified by inspecting `components/` and ensuring no orphan domain files (like `MDXComponents.tsx` or `Comments.tsx`) sit flat at the root level, and all application pages continue rendering standard layouts, headers, and footers without broken imports.

**Acceptance Scenarios**:

1. **Given** any layout or page requiring global navigation or layout framing, **When** importing `Header`, `Footer`, `MobileNav`, or `ThemeSwitch`, **Then** these components are sourced cleanly from `components/layout/`.
2. **Given** any page using generic UI widgets (Buttons, Cards, Inputs, Modals), **When** imported from `components/ui/`, **Then** all Shadcn/Radix components render seamlessly.

---

### User Story 3 - Elimination of Legacy Starter Debt (Priority: P3)

As a project architect, I want legacy starter directories (such as standalone `layouts/`, stray root `app/api-client.ts`, and loose `css/` files) refactored into canonical Next.js App Router locations, so that the repository strictly adheres to modern framework best practices.

**Why this priority**: Eliminates confusing dual paradigms (legacy Pages Router `layouts/` alongside modern App Router `app/**/layout.tsx`) and establishes a single idiomatic source of truth.

**Independent Test**: Can be verified by confirming `app/` contains strictly route handlers and page assemblies, `layouts/` is deprecated/absorbed into appropriate feature/layout folders, and the application builds with 0 TypeScript or lint errors.

**Acceptance Scenarios**:

1. **Given** the application root, **When** inspecting `app/`, **Then** no helper utilities like `api-client.ts` exist loosely in the routing directory.
2. **Given** a complete production build (`npm run build`), **When** executing static page generation and dynamic routing compilation, **Then** all routes compile cleanly with zero broken paths.

---

### Edge Cases

- **Circular Dependencies**: When two domains share entities (e.g., Blog author displaying a Member profile preview), what prevents circular imports between `features/blog` and `features/portfolio`? System MUST enforce shared data contracts in `lib/` or `types/`, never bidirectional feature imports.
- **Path Aliases & Imports**: What happens to existing deep import paths across all pages and actions? The TypeScript configuration (`tsconfig.json`) MUST maintain explicit path alias conventions (e.g., `@/features/*`, `@/components/*`, `@/lib/*`) with automated import updates.
- **Server Action Boundaries**: How are Next.js Server Actions preserved? Direct `'use server'` directives in actions must remain intact during file relocation so that client components can invoke them without bundler disconnects.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST establish a dedicated `features/` directory architecture encapsulating isolated business domains:
  - `features/blog/`: Toàn bộ nghiệp vụ bài viết, blog public & admin quản lý blog.
  - `features/portfolio/`: Hồ sơ năng lực cá nhân, portfolio public (`/members/[username]`) & admin portfolio (`/admin/portfolio`).
  - `features/projects/`: Quản lý dự án, showcase dự án public (`/projects`) & admin projects.
  - `features/events/`: Sự kiện câu lạc bộ, workshop public (`/events`) & admin events.
  - `features/generations/`: Album ảnh thế hệ/thành viên (Generations Album) & admin generations.
  - `features/auth/`: Cơ chế xác thực, SSO, session context, login form & user menu.
  - Các section tĩnh thuần túy của Landing Page (`home`) và trang Giới thiệu (`about`) sẽ được tổ chức hợp lý vào `components/home/` và `components/about/` (hoặc chuyển thành view components trực tiếp dưới `app/`) thay vì gượng ép thành feature domain.
- **FR-002**: Each feature directory MUST contain its own domain-specific assets where applicable (e.g., `components/`, `actions/`, `queries/`, `types/`).
- **FR-003**: The root `components/` directory MUST be pruned to contain only cross-cutting, domain-agnostic UI primitives:
  - `components/ui/`: Atomic design system components (buttons, badges, inputs, dialogs).
  - `components/layout/`: Global framing components (`Header`, `Footer`, `MobileNav`, `ThemeSwitch`, `SectionContainer`, `LayoutWrapper`).
  - `components/common/`: Shared application widgets without specific domain binding.
- **FR-004**: System MUST relocate non-route helper files out of `app/` (specifically moving `app/api-client.ts` to `lib/api/api-client.ts` or `lib/api-client.ts`).
- **FR-005**: System MUST absorb legacy `layouts/` (e.g., `BlogListLayout.tsx`, `EventsListLayout.tsx`, `PostLayoutAPI.tsx`) into their respective feature modules (`features/blog/` and `features/events/`).
- **FR-006**: System MUST update TypeScript module path aliases in `tsconfig.json` to support clean `@/features/*` imports alongside existing `@/*` aliases.
- **FR-007**: System MUST preserve all existing runtime behavior, security boundaries (RBAC Content vs Portfolio partition), authentication flows, and API contracts with 100% parity.

### Key Entities

- **Feature Module (`features/<domain>`)**: Encapsulated boundary containing UI components, Server Actions, data-access queries, and types dedicated to a specific business domain.
- **Design Primitive (`components/ui`)**: Domain-agnostic visual component following design system tokens and headless accessibility primitives.
- **Application Shell (`components/layout`)**: Global navigation and structural frames that wrap public or administration interfaces.
- **Core Infrastructure (`lib/`)**: Shared singletons, database connection clients, security utilities, and external service clients (MinIO, SSO, DB schema).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of domain-specific components previously loose in `components/` or `layouts/` are reassigned to their respective feature folders or `components/layout/`.
- **SC-002**: Zero files in `app/` that are not route conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, `route.ts`, metadata files, or route-local clients).
- **SC-003**: 100% pass rate on TypeScript type checking (`npx tsc --noEmit`) with 0 errors across all 34 routes.
- **SC-004**: Complete Next.js production build (`npm run build`) finishes with exit code 0.
- **SC-005**: All existing automated unit tests pass with zero regressions.

## Assumptions

- **Scope Boundary**: Refactoring focuses on code organization, modularity, and folder hierarchy. Database schemas, API payload structures, and external IdP interfaces remain unchanged.
- **Tooling & Aliases**: Next.js 15+ and TypeScript handle path aliases natively without requiring third-party build plugins.
- **Preserved Styling**: Tailwind CSS classes and Prism CSS configurations will remain functioning as-is without requiring style redesign.
