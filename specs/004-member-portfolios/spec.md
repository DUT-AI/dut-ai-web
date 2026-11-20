# Feature Specification: Member Portfolio Profiles

**Feature Branch**: `004-member-portfolios`

**Created**: 2026-11-20

**Status**: Ready for Planning

**Input**: User description: "Tích hợp trang portfolio cá nhân cho tất cả thành viên tại đường dẫn /members/[username], tự khởi tạo username ban đầu và cho phép chỉnh sửa; hỗ trợ quản lý Bio, Skills, Projects cá nhân, upload PDF CV, tự động đồng bộ các dự án thành viên đã tham gia từ hệ thống DUT-AI; giao diện đồng bộ chuẩn Dark/Light mode của DUT-AI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public Member Portfolio Viewing (Priority: P1)

As a visitor, recruiter, or peer, I want to access a member's personal portfolio page at `/members/[username]` so that I can discover their professional identity, technical skillsets, completed projects, and credentials.

**Why this priority**: Delivers the primary value of the feature (a publicly accessible showcase for every member) as an independent MVP.

**Independent Test**: Can be verified by navigating to `/members/[username]` for an active member and confirming that their bio, skills, projects, social contact links, and CV preview are cleanly rendered in both light and dark display modes.

**Acceptance Scenarios**:

1. **Given** an active member with an established portfolio, **When** a visitor visits `/members/[username]`, **Then** the page displays the member's full name, headline, avatar, biography, social links, categorized skills, showcased projects, and CV download option.
2. **Given** a visitor viewing the portfolio, **When** switching between light mode and dark mode, **Then** all portfolio sections adapt their color contrast and readability to match the organization's global theme.
3. **Given** a request for a username that does not exist, **When** the page loads, **Then** the visitor sees a user-friendly "Member Not Found" page with an option to explore the club member directory.

---

### User Story 2 - Member Portfolio Profile & CV Management (Priority: P2)

As an authenticated member, I want to edit my portfolio information (biography, skills, social links, custom username) and upload my PDF CV from my personal dashboard so that my public profile accurately represents my current achievements.

**Why this priority**: Enables members to self-serve and keep their portfolios up to date without requiring administrator intervention.

**Independent Test**: Can be tested independently by logging in as a member, updating bio/skills, changing username, uploading a PDF CV, saving changes, and observing the updated content on the public `/members/[username]` page.

**Acceptance Scenarios**:

1. **Given** a new or existing member without a custom handle, **When** their account is initialized, **Then** the system automatically generates an initial unique, URL-safe username based on their registered name or email identifier.
2. **Given** a member updating their username, **When** they enter a new valid, unused username, **Then** the system saves the change and updates the public portfolio URL accordingly.
3. **Given** a member entering a username already claimed by another user, **When** they attempt to save, **Then** the system rejects the change with a clear error message indicating the username is taken.
4. **Given** a member uploading a valid PDF document (under the allowed file size limit), **When** saving their profile, **Then** the document is stored securely and becomes viewable and downloadable on their public portfolio.
5. **Given** a member uploading a non-PDF file or an oversized file, **When** attempting to upload, **Then** the system displays a clear validation error and blocks the upload.

---

### User Story 3 - Automatic Project Synchronization (Priority: P3)

As a member and visitor, I want the portfolio to automatically include verified projects the member participated in within the club alongside any personal projects they added in a single unified showcase, so that all project contributions are credibly presented together.

**Why this priority**: Unlocks platform network effects and credibility by tying organizational project history directly into the member's profile without fragmenting the UI.

**Independent Test**: Can be tested independently by assigning a member to an organizational project in the system and verifying that the project automatically appears in the unified "Projects" section of their portfolio with an official attribution badge.

**Acceptance Scenarios**:

1. **Given** a member who is listed as a contributor on published club projects, **When** their portfolio is viewed, **Then** those club projects appear in the unified project showcase alongside any personal projects, carrying an official "DUT AI Club Verified" badge and role title.
2. **Given** a member who also created custom personal projects, **When** their portfolio is viewed, **Then** both club projects and personal projects are displayed together seamlessly in one clean grid.

---

### User Story 4 - Discovery from Member Directory (Priority: P4)

As a visitor exploring the club's "About" page or member albums, I want to click on any member's card to navigate directly to their personal portfolio.

**Why this priority**: Completes the end-to-end user navigation flow across the web application.

**Independent Test**: Can be tested by navigating to `/about`, clicking on any member card in the generation albums, and confirming redirection to their corresponding `/members/[username]` portfolio.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the club generation album or member list on `/about`, **When** clicking on a member's card or avatar, **Then** the visitor is navigated directly to that member's portfolio page.

---

### Edge Cases

- **Inactive or Disabled Accounts**: When an account is suspended or marked inactive, their public `/members/[username]` route must return a 404 / inactive notice to prevent stale or unapproved public indexing.
- **Empty Portfolio State**: When a newly registered member has not yet added skills, personal projects, or a CV, the page must display a polished default layout highlighting their basic membership information and club affiliation, without broken layout elements or empty boxes.
- **Username Character Constraints**: Usernames must only contain lowercase alphanumeric characters, hyphens, and underscores (3 to 30 characters), and cannot clash with reserved application paths (e.g., `admin`, `api`, `login`, `about`, `projects`, `blog`, `settings`).
- **CV Viewing on Mobile**: On mobile devices where inline PDF embedding may be constrained, the portfolio must provide a direct download and browser-native viewer fallback button.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST assign a unique, URL-safe initial username to each registered member upon account creation.
- **FR-002**: System MUST allow authenticated members to modify their username, enforcing uniqueness and format constraints (lowercase alphanumeric, dashes, underscores, length 3-30).
- **FR-003**: System MUST prevent members from claiming reserved system keywords as usernames (e.g., `admin`, `api`, `blog`, `projects`, `about`, `events`).
- **FR-004**: System MUST render a public portfolio page at `/members/[username]` displaying member profile details (Full name, avatar, bio, headline, social links).
- **FR-005**: System MUST support managing and displaying a list of professional skills and technical competencies categorized appropriately.
- **FR-006**: System MUST automatically retrieve and display all verified club projects that the member is associated with in the organizational repository.
- **FR-007**: System MUST allow members to add, edit, and remove custom personal projects with title, description, thumbnail/preview image, source code repository link, and live demonstration link.
- **FR-008**: System MUST allow members to upload a PDF resume document (maximum size 10MB) and make it available for inline viewing and downloading on the portfolio.
- **FR-009**: System MUST allow members to remove or replace their uploaded CV at any time.
- **FR-010**: System MUST adapt all portfolio views to both Light and Dark color themes adhering to the organization's design system tokens and accessibility standards.
- **FR-011**: System MUST generate search engine optimization (SEO) metadata (title, description, and OpenGraph social preview images) dynamically for each member's portfolio.
- **FR-012**: System MUST link member profiles displayed on the club "About" directory to their respective `/members/[username]` pages.

### Key Entities *(include if feature involves data)*

- **Member Profile / Portfolio**: Represents a member's public identity. Contains attributes: user reference, unique handle (username), headline/role title, biographical summary, avatar reference, social profiles (GitHub, LinkedIn, Twitter/X, personal website), display status (public/private).
- **Member Skill Item**: Represents a technical or domain competency. Contains attributes: name, category, proficiency/order.
- **Member Personal Project**: Represents an independent showcase project. Contains attributes: member reference, title, description, thumbnail image URL, repository URL, demonstration URL, display order.
- **Member Resume Asset**: Represents the uploaded curriculum vitae document. Contains attributes: member reference, file URL, original file name, file size, upload timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can load any public member portfolio page in under 1.5 seconds on average network conditions.
- **SC-002**: 100% of active club members automatically receive a functional, accessible portfolio page upon profile initialization.
- **SC-003**: Members can complete editing and publishing their bio, skills, and CV in under 3 minutes.
- **SC-004**: Portfolio layouts pass Web Content Accessibility Guidelines (WCAG) AA standards for color contrast in both light and dark themes.
- **SC-005**: 100% of social media shares (e.g., Zalo, Facebook, LinkedIn) generate accurate OpenGraph preview cards featuring the member's name, headline, and avatar.

## Assumptions

- Authentication and user session management are provided by the existing club authentication system.
- The existing cloud/local object storage (S3/MinIO) is available for storing uploaded PDF resumes and project thumbnail assets.
- Members who have not customized their username will retain their automatically generated initial username without service disruption.
- Verified club project associations are maintained in the system's existing project database schema.
