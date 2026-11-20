# Technical Research & Architecture Decisions: Role-Based Content Partitioning

**Feature**: `006-role-based-content-partitioning`  
**Date**: 2026-11-21  
**Status**: Completed  

---

## 1. Architectural Decisions

### Decision 1: Dual Functional Partitioning within `/admin` Namespace

- **Decision**: Retain the existing `/admin` route namespace while logically and visually dividing all administrative capabilities into two discrete functional partitions:
  1. **Phân vùng Quản lý nội dung (Content Management Zone)**:
     - Routes: `/admin` (Dashboard Overview), `/admin/blogs`, `/admin/projects`, `/admin/events`, `/admin/posts`, `/admin/generations`, `/admin/keywords`, `/admin/introductions`.
     - Access requirement: User's `role_names` must contain `"Content"` (or `"admin"`).
  2. **Phân vùng Thông tin thành viên (Member Information Zone)**:
     - Routes: `/admin/portfolio` (Personal Portfolio management).
     - Access requirement: Accessible to all authenticated members (both Content users and standard club members).
- **Rationale**:
  - Eliminates the need to refactor existing URL hierarchies (e.g. moving portfolio to `/account` or `/member`), avoiding broken bookmarks, external links, or complex rewrite rules.
  - Aligns cleanly with the existing Next.js App Router layout structure under `frontend/app/admin/layout.tsx`.
  - Cleanly fulfills the user's specific operational mandate: Content role manages organizational content; other members manage their own personal profile.
- **Alternatives Considered**:
  - *Alternative A: Move Personal Portfolio to `/member/portfolio` or `/account/portfolio`*. Rejected: Would require altering database references, route structures, and navigation configurations across multiple components for zero architectural benefit.
  - *Alternative B: Separate subdomain for member portfolio*. Rejected: Excessive operational overhead and contradicts the unified web architecture.

---

### Decision 2: Multi-Layer Defense-in-Depth Authorization Guarding

- **Decision**: Enforce role-based access control across three coordinated architectural layers:
  1. **Edge Middleware Guard (`frontend/middleware.ts`)**:
     - Fast checks on incoming requests to Content routes. Decodes the JWT token payload (zero network call, pure edge execution) to check if `role_names` contains `"content"` or `"admin"`.
     - If an authenticated non-Content user requests a Content zone route, the middleware redirects them to `/admin/portfolio?denied=content`.
  2. **Layout & Client Context Guard (`frontend/app/admin/layout.tsx`)**:
     - Leverages `SsoAuthContext` and user profile loaded via `/api/v1/auth/me`.
     - If the client detects the user is trying to render a content route without the Content role, it immediately halts rendering the content children and triggers a client-side transition to `/admin/portfolio`.
     - Dynamically structures the navigation sidebar to display only the sections the user is authorized to view.
  3. **Server Action & Backend Mutation Guard (`requireContentSession()`)**:
     - Validates the user's session and roles on every server action mutating content resources (blogs, projects, events, posts, generations, keywords, introductions).
     - Throws a typed `FORBIDDEN` error if the caller lacks the required role, preventing circumvention via direct HTTP POST requests.
- **Rationale**:
  - Defense-in-depth ensures that UI hiding cannot be bypassed by malicious actors.
  - Edge redirection minimizes server compute and avoids hydration mismatch or render flashing.
  - Action-level validation protects data integrity at the database boundary.
- **Alternatives Considered**:
  - *Client-only checks*: Highly vulnerable to tampering or manual API calls.
  - *Server-only checks without Middleware*: Causes client flash where the unauthorized page begins loading before being bounced away.

---

### Decision 3: Case-Insensitive Role Normalization & System Administrator Authority

- **Decision**:
  - Implement a dedicated role evaluation utility: `hasContentAccess(userOrRoles)` that trims and lowercases role strings before comparing (`lower === 'content' || lower === 'admin'`).
  - Extend `UserRole` enum in `frontend/lib/enums/roles.ts` to include `CONTENT = 'Content'`.
  - Maintain the rule that the `"admin"` role retains universal administrative authority across both partitions.
- **Rationale**:
  - Upstream identity providers or legacy tokens may provide `"Content"`, `"content"`, or `"CONTENT"`. Case-insensitive normalization prevents accidental lockouts.
  - Club administrators (`admin`) must have operational access to oversee all modules and assist content editors.
- **Alternatives Considered**:
  - *Strict case-sensitive comparison (`role === 'Content'`) *: Brittle when integrating with external Identity Providers or varied JWT generators.
  - *Strictly forbidding `admin` from Content zone*: Unrealistic for real-world operations where the club president or technical admin needs to intervene or configure SEO keywords.

---

### Decision 4: Adaptive Navigation UX & Non-Intrusive Feedback

- **Decision**:
  - Partition the admin sidebar into clear section headers:
    - `QUẢN LÝ NỘI DUNG`: Overview, Blogs, Projects, Events, Moments, Generations, Keywords, Intro. (Rendered only for Content / Admin users).
    - `THÔNG TIN THÀNH VIÊN`: Hồ sơ cá nhân. (Rendered for all users).
  - In `UserMenuDropdown.tsx`:
    - Content/Admin users see: "Quản lý nội dung" (or "Bảng quản trị") -> `/admin`, and "Hồ sơ cá nhân" -> `/admin/portfolio`.
    - Standard members see only: "Hồ sơ cá nhân" -> `/admin/portfolio`.
  - When a user is redirected away from a restricted content route due to `?denied=content`, display a subtle, non-intrusive notification (Sonner toast: *"Bạn không có quyền truy cập khu vực Quản lý nội dung. Đã chuyển hướng về Hồ sơ cá nhân."*).
- **Rationale**:
  - Improves usability by not cluttering regular members' views with administrative tools they cannot use.
  - Informs the user why they were redirected rather than silently bouncing them without explanation.
- **Alternatives Considered**:
  - *Showing grayed-out/disabled links*: Clutters the interface and creates a frustrating experience.
  - *Showing a hard 403 error page*: Abrupt and disorienting compared to a graceful redirect to the user's available tools.
