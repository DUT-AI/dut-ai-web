# Feature Specification: Role-Based Content & Member Partitioning (Phân quyền Quản lý nội dung & Thông tin thành viên)

**Feature Branch**: `006-role-based-content-partitioning`

**Created**: 2026-11-21

**Status**: Ready for Planning

**Input**: User description: "Phân quyền theo role_names: Chỉ người có role_names chứa 'Content' mới được truy cập phân vùng chức năng Quản lý nội dung (bao gồm tất cả chức năng quản trị hiện tại ngoại trừ Hồ sơ cá nhân: Tổng quan, Bài viết, Dự án, Sự kiện, Khoảnh khắc, Album thế hệ, Từ khóa, Giới thiệu). Phân vùng 'Thông tin thành viên' chỉ bao gồm Hồ sơ cá nhân dành cho những người dùng còn lại (thành viên thông thường)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Content Role Administrative Access to Content Zone (Priority: P1)

As a club content creator, editor, or manager possessing the "Content" role (or system administrator), I want to access all administrative content modules (Blogs, Projects, Events, Moments, Generations, Keywords, Intro, and Dashboard Overview), so that I can create, curate, publish, and maintain club content across the platform.

**Why this priority**: Delivers the primary access pathway for content team members to perform their day-to-day content publishing responsibilities.

**Independent Test**: Sign in with an account having `role_names` containing `"Content"`. Navigate to `/admin` and each content management module (`/admin/blogs`, `/admin/projects`, `/admin/events`, `/admin/posts`, `/admin/generations`, `/admin/keywords`, `/admin/introductions`). Verify that access is fully granted, all management interfaces load correctly, and content operations function as expected.

**Acceptance Scenarios**:

1. **Given** an authenticated user whose `role_names` includes `"Content"` (or `"admin"`), **When** they navigate to `/admin` or any content management sub-route (`/admin/blogs`, `/admin/projects`, `/admin/events`, `/admin/posts`, `/admin/generations`, `/admin/keywords`, `/admin/introductions`), **Then** the system grants access and renders the appropriate management view.
2. **Given** an authorized Content user, **When** they create, edit, or delete content items (such as publishing a blog post or adding an event), **Then** the operations succeed and persist to the database.
3. **Given** an authorized Content user, **When** they view the admin dashboard overview, **Then** all operational statistics and quick-access cards for content modules are visible.

---

### User Story 2 - General Member Access to Member Information Zone & Content Restriction (Priority: P1)

As an authenticated general member without the "Content" role, I want to access the "Thông tin thành viên" partition to manage my personal portfolio, while being prevented from viewing or modifying organizational content that I am not authorized to manage.

**Why this priority**: Establishes critical boundary enforcement ensuring standard club members only see their personal information and cannot access or manipulate administrative club content.

**Independent Test**: Sign in with an account that does not have the `"Content"` role (e.g., standard member/teammate). Navigate to `/admin/portfolio` and confirm complete ability to view and edit personal portfolio details. Next, attempt to navigate to `/admin`, `/admin/blogs`, or `/admin/projects`. Confirm immediate redirection to `/admin/portfolio` with an explanatory notification and zero data exposure.

**Acceptance Scenarios**:

1. **Given** an authenticated user without the `"Content"` role (and without `"admin"`), **When** they navigate to `/admin/portfolio`, **Then** the system grants access and allows them to view and edit their own portfolio data.
2. **Given** an authenticated user without the `"Content"` role, **When** they attempt to directly access `/admin` or any content management route (e.g., `/admin/blogs`, `/admin/projects`, `/admin/events`, `/admin/posts`, `/admin/generations`, `/admin/keywords`, `/admin/introductions`), **Then** the system blocks access and redirects them to `/admin/portfolio` with a permission notification.
3. **Given** an authenticated user without the `"Content"` role, **When** viewing the administration interface, **Then** only the "Thông tin thành viên" navigation section containing "Hồ sơ cá nhân" is displayed, and all content management navigation links are hidden.

---

### User Story 3 - Server-Side & Mutation Authorization Guarding (Priority: P2)

As a security auditor, I want all server actions, mutation endpoints, and backend routes associated with content management to verify the caller's role before processing changes, so that malicious or unauthorized users cannot bypass UI controls by dispatching raw HTTP requests.

**Why this priority**: Prevents privilege escalation and unauthorized modifications at the data layer, ensuring robust security beyond client-side UI visibility.

**Independent Test**: Submit a direct server action or API call to create or update a blog post, event, or project using the credentials of a non-Content user. Verify that the server rejects the request with an authorization error and no records are created or altered.

**Acceptance Scenarios**:

1. **Given** an incoming server action or mutation request to create, update, or delete a blog, project, event, moment, generation album, keyword, or introduction, **When** the authenticated caller's session does not contain the `"Content"` role (or `"admin"`), **Then** the system aborts execution and returns an authorization failure.
2. **Given** an unauthorized mutation attempt, **When** rejected by the server, **Then** the system logs the event and does not expose internal system internals or schema details.

---

### User Story 4 - Dynamic Navigation Shell & User Dropdown Adaptation (Priority: P2)

As an authenticated user, I want the administrative sidebar and top navigation menu to reflect only the sections I am permitted to access, so that my interface is clear, clean, and free of inaccessible links.

**Why this priority**: Provides an intuitive, uncluttered user experience tailored to each user's authorization tier without displaying broken or dead-end links.

**Independent Test**: Inspect the navigation menu and sidebar under both a Content role session and a standard member session. Verify that Content users see both the Content Management section and Member section, while standard members see only the "Thông tin thành viên" section.

**Acceptance Scenarios**:

1. **Given** a user with the `"Content"` role, **When** viewing the sidebar, **Then** it renders the "Quản lý nội dung" group with links to Overview, Blogs, Projects, Events, Moments, Generations, Keywords, and Intro.
2. **Given** a user without the `"Content"` role, **When** viewing the sidebar, **Then** all content management links are omitted, leaving only the "Thông tin thành viên" group with "Hồ sơ cá nhân".
3. **Given** a user without the `"Content"` role, **When** opening the header user profile dropdown, **Then** the link labeled "Bảng quản trị (Admin)" is hidden or redirected directly to "Hồ sơ cá nhân" (`/admin/portfolio`).

---

### User Story 5 - Content Creator Self-Portfolio Management (Priority: P3)

As a content creator who is also an active club member, I want to access "Hồ sơ cá nhân" within the "Thông tin thành viên" partition, so that I can update my own profile and portfolio showcase without needing a separate account.

**Why this priority**: Ensures convenience and operational parity for content team members who are also registered members of the club.

**Independent Test**: Authenticate as a Content user, navigate to `/admin/portfolio`, and confirm that the user can seamlessly view and edit their own member portfolio.

**Acceptance Scenarios**:

1. **Given** an authenticated user with the `"Content"` role, **When** they navigate to `/admin/portfolio`, **Then** the system permits access and allows full editing of their own member portfolio.

---

## Edge Cases

- **Multiple Assigned Roles**: When a user possesses multiple roles in `role_names` (e.g., `["teammate", "Content", "Trainer"]`), the presence of `"Content"` MUST grant access to the Content Management partition.
- **Case-Insensitive Role Matching**: Role comparison MUST treat `"content"`, `"Content"`, and `"CONTENT"` equivalently to prevent authentication quirks caused by casing variations across systems.
- **Mid-Session Role Revocation**: If an administrator revokes a user's "Content" role while they are actively editing a blog post, any subsequent save attempt MUST be blocked by server-side verification and return a clean error requiring re-authorization.
- **Direct Bookmarked Links & Deep Links**: When a non-Content user navigates directly to a bookmarked content creation URL (e.g., `/admin/blogs/new`), the route guard MUST intercept the request and redirect smoothly to `/admin/portfolio` rather than crashing or showing a 404/500 error.
- **System Administrator Privilege**: Users possessing the system `"admin"` role retain universal administrative privileges, granting them access to both the Content Management partition and the Member Information partition.
- **User Without Any Roles**: An authenticated user with an empty `role_names` array is treated as a standard member, granting access strictly to `/admin/portfolio`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST divide the administrative workspace into two distinct functional partitions: "Quản lý nội dung" (Content Management Zone) and "Thông tin thành viên" (Member Information Zone).
- **FR-002**: System MUST place the following modules under the "Quản lý nội dung" partition:
  - Dashboard Overview (`/admin`)
  - Blogs (`/admin/blogs`)
  - Projects (`/admin/projects`)
  - Events (`/admin/events`)
  - Moments (`/admin/posts`)
  - Generations (`/admin/generations`)
  - Keywords / SEO (`/admin/keywords`)
  - Introductions (`/admin/introductions`)
- **FR-003**: System MUST place the Personal Portfolio module (`/admin/portfolio`) under the "Thông tin thành viên" partition.
- **FR-004**: System MUST check the `role_names` array of the active authenticated session before authorizing access to any view or resource in the "Quản lý nội dung" partition.
- **FR-005**: System MUST grant access to the "Quản lý nội dung" partition exclusively to users whose `role_names` contains `"Content"` (or the primary `"admin"` role).
- **FR-006**: System MUST perform role comparisons in a case-insensitive manner (e.g., matching `"content"`, `"Content"`, `"CONTENT"`).
- **FR-007**: System MUST block users without the `"Content"` role (and without `"admin"`) from accessing any "Quản lý nội dung" page, automatically redirecting them to `/admin/portfolio`.
- **FR-008**: System MUST permit all authenticated users to access the "Thông tin thành viên" partition (`/admin/portfolio`) to view and update their individual portfolio.
- **FR-009**: System MUST dynamically adapt the administrative sidebar navigation:
  - For Content users (and admins): render the "Quản lý nội dung" module group alongside "Thông tin thành viên".
  - For non-Content users: render only the "Thông tin thành viên" group ("Hồ sơ cá nhân"), hiding all content management links.
- **FR-010**: System MUST adapt the top-level user account dropdown menu in the header so that non-Content users are guided directly to "Hồ sơ cá nhân" instead of the general admin overview.
- **FR-011**: System MUST enforce role verification on all backend server actions, mutations, and API routes that modify content resources (blogs, projects, events, posts, generations, keywords, introductions), returning an authorization error if the caller lacks the required role.
- **FR-012**: System MUST display a clear, non-intrusive notification (e.g., toast or banner) when a user is redirected away from a restricted content route to their portfolio.

### Key Entities *(include if feature involves data)*

- **Functional Partition**: Logical grouping of administrative capabilities into "Quản lý nội dung" (content creation/curation) and "Thông tin thành viên" (personal profile/portfolio management).
- **Content Role**: Authorization descriptor (`"Content"`) designating members authorized to manage organizational content assets.
- **User Role Assignment**: The list of roles (`role_names`) linked to the user's authenticated profile session.
- **Content Resource**: Any organizational publication asset including blogs, project portfolios, events, moment photos, generation albums, SEO keywords, and club introductory records.
- **Member Portfolio**: Self-managed profile and showcase data belonging to an individual club member.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unauthorized access attempts by non-Content users to content management URLs are intercepted and redirected to `/admin/portfolio` without displaying restricted data.
- **SC-002**: 100% of users possessing the `"Content"` role can access and perform management actions across all designated content modules without encountering permission denials.
- **SC-003**: 0 unauthorized data mutations succeed on any content management server action or backend route when executed by users without the `"Content"` role.
- **SC-004**: Administrative navigation sidebar and header menus render the correct role-partitioned links within 200ms of session initialization with 0 layout shift or flash of unauthorized items.
- **SC-005**: 100% of authenticated club members can access and manage their own portfolio at `/admin/portfolio` regardless of whether they have the `"Content"` role.

---

## Assumptions

- User role assignments are provided in the `role_names: string[]` attribute of the authenticated session profile from the DUT-AI Single Sign-On Identity Provider.
- The `"admin"` role retains universal administrative authority across both partitions as part of system governance.
- Users with the `"Content"` role can also access the "Thông tin thành viên" partition to manage their own member profile and portfolio.
- The default home destination for authenticated users without the `"Content"` role when entering `/admin` is `/admin/portfolio`.
- Unauthenticated visitors attempting to access any administrative route will continue to be redirected to the central login portal as established by Feature 005 (SSO Authentication).
