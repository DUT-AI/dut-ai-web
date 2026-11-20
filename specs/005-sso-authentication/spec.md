# Feature Specification: DUT-AI Ecosystem Single Sign-On (SSO) Integration

**Feature Branch**: `005-sso-authentication`

**Created**: 2026-11-20

**Status**: Ready for Planning

**Input**: User description: "Tích hợp cơ chế True SSO (Single Sign-On) của hệ sinh thái DUT-AI vào ứng dụng này để chia sẻ phiên đăng nhập liền mạch giữa các subdomain (*.dutai.io.vn). Cookie xác thực dùng chung ở domain cha .dutai.io.vn với access_token và refresh_token. Identity Provider tại https://manage.dutai.io.vn (endpoint /api/v1/auth/me) và Portal đăng nhập trung tâm tại https://workspace.dutai.io.vn/login?redirect=... Hỗ trợ middleware kiểm tra phiên đăng nhập, fetch thông tin user profile & RBAC permissions, và cơ chế Single Sign-Out xóa cookie toàn hệ thống."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seamless Shared Cross-Subdomain Authentication (Priority: P1)

As an authenticated member or administrator of any application in the DUT-AI ecosystem (such as Workspace Hub or Management Portal), I want to navigate to this web application and be recognized immediately without re-entering credentials, so that my workflow across organizational tools is unified and frictionless.

**Why this priority**: Delivers the core value proposition of True SSO. Eliminates fragmented login barriers across organizational subdomains as the foundational MVP slice.

**Independent Test**: Log into `workspace.dutai.io.vn` in a browser, then navigate directly to this web application. Verify that the user is immediately recognized as authenticated with their identity loaded, without encountering a login screen.

**Acceptance Scenarios**:

1. **Given** a user with an active, valid authentication session on the shared `.dutai.io.vn` domain, **When** they visit this application, **Then** the system automatically detects their session credentials and authenticates them seamlessly.
2. **Given** an authenticated user accessing the application, **When** the application loads, **Then** their profile information (name, avatar, email, assigned roles, and permissions) is retrieved and available throughout the application.
3. **Given** a user who transitions between different pages within the application, **When** navigating, **Then** their session state remains consistent without triggering repeated full-page re-authentication prompts.

---

### User Story 2 - Protected Route Guarding & Central Login Redirection (Priority: P1)

As an unauthenticated visitor attempting to access restricted administrative or private member areas, I want to be redirected automatically to the central authentication portal with my intended destination preserved, so that I can sign in securely and return directly to the resource I requested.

**Why this priority**: Essential security guard that enforces access boundaries while providing a smooth, industry-standard authentication flow.

**Independent Test**: In an incognito browser window without credentials, navigate directly to a protected path (e.g., `/admin` or private member management views). Confirm immediate redirection to `https://workspace.dutai.io.vn/login?redirect=<encoded_current_url>`. Complete authentication at the portal and verify automatic redirection back to the originally requested URL.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they attempt to access a protected application route (such as `/admin/*`), **Then** the system immediately redirects them to the central login portal with a return redirect query parameter pointing to the requested URL.
2. **Given** an unauthenticated visitor browsing public routes (such as the landing page, club blogs, public member portfolios `/members/[username]`, about page, and static assets), **When** they navigate, **Then** they can browse uninterrupted without receiving an authentication redirect.
3. **Given** a user successfully completing login at the central portal, **When** the portal redirects back with session cookies established, **Then** the application grants immediate access to the destination page.

---

### User Story 3 - Role-Based Access Control (RBAC) & Profile Context (Priority: P2)

As an authenticated user, I want the application to respect my organizational roles and specific permissions, so that I only see actions and content appropriate to my authorization level (e.g., administrator management controls vs. general member features).

**Why this priority**: Ensures governance, protects sensitive operational features, and tailors the UI to each user's permissions.

**Independent Test**: Authenticate as a user with member-level permissions and verify that administrative actions and views are restricted with a clear access denial notice. Next, authenticate with administrator privileges and confirm full access to administrative capabilities.

**Acceptance Scenarios**:

1. **Given** an authenticated user with standard member privileges, **When** they attempt to access an administrative view or trigger an administrative action, **Then** the application denies access gracefully with a clear permission notice and does not crash.
2. **Given** an authenticated user with required permissions (e.g., content editor or club administrator), **When** they access management tools, **Then** all authorized actions are enabled and accessible.
3. **Given** an authenticated user viewing the interface, **When** the global header renders, **Then** it presents their profile avatar, display name, and relevant role badges.

---

### User Story 4 - Unified Single Sign-Out (Single Logout) (Priority: P2)

As an authenticated user, I want to log out from this application and have my shared session cleanly terminated across the entire `.dutai.io.vn` domain, so that my account is securely signed out on this device.

**Why this priority**: Vital security requirement ensuring sessions are comprehensively revoked when a user deliberately ends their session.

**Independent Test**: Click the "Log out" button within the application. Verify that the shared authentication cookies are deleted for the `.dutai.io.vn` domain, the user is redirected to the central login portal, and subsequent attempts to access protected routes require a new login.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they click or trigger the logout action, **Then** the application clears the shared session tokens across the root `.dutai.io.vn` domain.
2. **Given** a completed logout request, **When** cleanup finishes, **Then** the user is redirected to the central login portal (`https://workspace.dutai.io.vn/login`).
3. **Given** a user who has logged out, **When** they attempt to navigate back to protected routes using the browser's back button or a direct bookmark, **Then** access is denied and they are redirected to log in.

---

### User Story 5 - Contextual Session State on Public Pages (Priority: P3)

As a visitor or member browsing public areas of the application, I want the header navigation to dynamically reflect whether I am currently signed in (showing my avatar and quick menu) or a guest (showing a "Sign In" button), so that I always know my session state and can quickly access my tools.

**Why this priority**: Creates a cohesive, modern navigation experience connecting public informational content to authenticated features.

**Independent Test**: Navigate to the public homepage while signed in and confirm avatar with dashboard/profile dropdown appears. Open the homepage in an unauthenticated session and confirm a prominent "Sign In" button appears which links to the central portal.

**Acceptance Scenarios**:

1. **Given** an active authenticated session, **When** viewing any public page, **Then** the navigation displays the user's avatar and a menu with quick links (e.g., to their portfolio, admin area if authorized, and logout).
2. **Given** an unauthenticated visitor, **When** viewing any public page, **Then** the navigation displays a "Sign In" action that redirects to the central login portal with the current page URL as the redirect parameter.

---

### Edge Cases

- **Expired or Revoked Token**: When a user's session token expires or is revoked on the Identity Provider while they are navigating the application, protected routes must seamlessly catch the invalidation, clear stale local session data, and redirect to the central login portal without infinite redirect loops.
- **Central Identity Provider Outage / Network Failure**: If the central IdP (`manage.dutai.io.vn`) is temporarily unreachable or returns HTTP 5xx errors during profile fetching, the application must handle the failure gracefully (displaying a helpful notification or retrying) rather than crashing or showing a blank page.
- **Concurrent Sign-Out from Another Subdomain**: If a user logs out from `workspace.dutai.io.vn` in another browser tab, when they subsequently trigger an action or navigate in this application, the missing cookie must be detected promptly and the UI transitioned to unauthenticated state.
- **Local Development Environment (Non-Production Domains)**: When developers run the project locally on `localhost`, browsers do not share cookies scoped to `.dutai.io.vn`. The system must support development configuration (such as local fallback tokens or mock session profiles) so engineers can develop and test protected features offline.
- **Redirect Loop Prevention**: If the current URL is already a login or error page, redirect handling must sanitize the target URL to prevent circular redirect loops.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST inspect incoming requests for shared session credentials (`access_token`, `refresh_token`) scoped to the parent domain (`.dutai.io.vn`).
- **FR-002**: System MUST permit unrestricted access for all visitors to public application routes (including homepage, public blogs, member portfolios `/members/[username]`, about page, public APIs, and static assets).
- **FR-003**: System MUST protect restricted administrative paths (`/admin/*`) and private member resources by verifying the presence and validity of active session credentials.
- **FR-004**: System MUST redirect unauthenticated requests targeting protected routes to the central login portal (`https://workspace.dutai.io.vn/login`) with the full requested URL encoded in the `redirect` query parameter.
- **FR-005**: System MUST retrieve the current user's profile information (including unique ID, name, email, avatar URL, role names array, and permissions array) from the central Identity Provider (`https://manage.dutai.io.vn/api/v1/auth/me`).
- **FR-006**: System MUST provide an application-wide user context/state provider to expose user profile data, authentication status, and permission-checking utilities to client components.
- **FR-007**: System MUST support role-based access control (RBAC) evaluations, enabling components and server routes to check if the active user possesses specific roles or permissions.
- **FR-008**: System MUST provide an API endpoint and client action for Single Sign-Out that clears shared cookies (`access_token`, `refresh_token`) across the `.dutai.io.vn` root domain with appropriate security flags (`HttpOnly`, `SameSite=Lax`, `Secure`).
- **FR-009**: System MUST redirect users to the central authentication portal (`https://workspace.dutai.io.vn/login`) upon successful sign-out.
- **FR-010**: System MUST validate token expiration and structure, rejecting expired or malformed tokens before granting access to protected views.
- **FR-011**: System MUST provide a development mode configuration allowing developers to emulate or supply authentication credentials when running on `localhost`.
- **FR-012**: System MUST render an authenticated user avatar, display name, and user menu in the global header when an active session is detected.
- **FR-013**: System MUST render a "Sign In" action on public page headers for guests that directs them to the central login portal with the current URL as return destination.
- **FR-014**: System MUST handle API failures from the Identity Provider gracefully without breaking public page rendering or unauthenticated browsing.

### Key Entities *(include if feature involves data)*

- **User Profile**: Represents the authenticated identity returned by the Identity Provider. Contains attributes: `id` (unique identifier), `name` (full display name), `email` (verified email address), `avatar_url` (optional image link), `role_names` (array of assigned roles, e.g., "admin", "member"), and `permissions` (array of granular permission keys).
- **Authentication Session**: Represents the active session credentials state on the client and edge. Contains attributes: `access_token` (JWT credential), `refresh_token` (renewal credential), `expires_at` (expiration timestamp), and `domain_scope` (`.dutai.io.vn`).
- **Route Access Rule**: Represents the policy determining whether a path pattern is `Public`, `Protected-Member`, or `Protected-Admin`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users with an active session on any `.dutai.io.vn` ecosystem application can enter and use this application without encountering a separate login prompt.
- **SC-002**: Unauthenticated access attempts to protected routes are intercepted and redirected to the central portal within 100ms.
- **SC-003**: 100% of logout requests completely clear authentication tokens across the `.dutai.io.vn` domain, requiring new credentials for any subsequent protected action.
- **SC-004**: Public pages and static assets remain 100% accessible to anonymous visitors without encountering authentication blocks, delays, or redirect loops.
- **SC-005**: User profile information (name, avatar, roles) renders in the application header within 1 second of page initialization for authenticated sessions.

## Assumptions

- The production web application runs on a subdomain of `dutai.io.vn` (e.g., `web.dutai.io.vn` or `dutai.io.vn`), allowing the browser to automatically include parent domain cookies.
- The central Identity Provider at `https://manage.dutai.io.vn` is available and responds with user profiles via `GET /api/v1/auth/me`.
- The central login portal at `https://workspace.dutai.io.vn/login` accepts and respects the `redirect` query parameter after successful authentication.
- Shared authentication cookies use standard security attributes: `Domain=.dutai.io.vn`, `Path=/`, `HttpOnly`, `SameSite=Lax`, and `Secure`.
- For local development on `localhost`, a mock or environment variable mechanism can be configured so developers do not need live `.dutai.io.vn` cookies.
- Public routes (marketing homepage, blogs, member portfolio showcases, public contact forms) must always remain accessible to anonymous visitors without requiring sign-in.
