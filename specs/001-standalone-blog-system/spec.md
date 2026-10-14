# Feature Specification: Standalone Blog Management System with Multi-Author Support

**Feature Branch**: `001-standalone-blog-system`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Tôi muốn chỉnh sửa lại phần quản lý blog, tôi mong muốn bỏ đi phần get bài viết bên hệ thống quiz, chỉnh sửa lại để độc lập 1 hệ thống riêng luôn, 1 bài viết có thể có 1 hoặc nhiều tác giả"

## Clarifications

### Session 2026-10-14

- Q: Bạn muốn loại trình soạn thảo (Editor) nào được tích hợp trong trang quản trị Blog để quản lý nội dung bài viết? (FR-003) → A: Markdown Editor với thanh công cụ định dạng và chế độ xem trước (Live Preview).
- Q: Nguồn thông tin tác giả (Authors) được quản lý như thế nào khi gán vào bài viết? (FR-004) → A: Chỉ người dùng nội bộ: Tác giả bắt buộc phải là tài khoản thành viên/người dùng đã tồn tại trong cơ sở dữ liệu hệ thống (như hiện tại).
- Q: Hệ thống nên xử lý các bài viết blog hiện có (đang phụ thuộc vào Quiz slug và chưa có trường content lưu trong cơ sở dữ liệu) như thế nào trong quá trình chuyển đổi? (FR-005) → A: Cập nhật thủ công (Manual Update): Không cần script tự động; các bài viết cũ sẽ để trống content (hoặc placeholder) và quản trị viên sẽ tự cập nhật nội dung qua trang admin mới.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Independent Blog Posts (Priority: P1)

As an administrator or content creator, I want to create, edit, and publish blog articles directly within the DUT-AI platform with complete article content stored natively, without relying on or querying any external Quiz service.

**Why this priority**: Eliminating dependency on the external Quiz API is the core purpose of this feature. Without direct content authoring and local persistence, the blog system remains broken or tied to an external service.

**Independent Test**: An admin can create a new blog post with a title, summary, rich content, and cover image directly in the admin dashboard, save it, and view the full article rendered seamlessly on the public blog page without any network requests to the Quiz service.

**Acceptance Scenarios**:

1. **Given** an admin is on the blog creation page, **When** they fill in title, slug, summary, content, and submit the form, **Then** the article is saved locally and can be accessed at `/blog/[slug]` displaying the full content.
2. **Given** an existing blog post, **When** an admin edits its content in the admin dashboard and saves changes, **Then** the updated content is immediately reflected on the public blog page.
3. **Given** the external Quiz service is unreachable or offline, **When** a user visits `/blog` or `/blog/[slug]`, **Then** the blog system functions completely normally with zero downtime or error related to the Quiz service.

---

### User Story 2 - Multi-Author Attribution and Collaboration (Priority: P2)

As a content manager, I want to associate one or multiple authors with a single blog post so that team collaborations, co-written research articles, and student contributions are properly credited.

**Why this priority**: Technical articles, research notes, and club announcements often involve multiple contributors. Providing flexible multi-author attribution ensures proper recognition for all contributors.

**Independent Test**: An admin creates an article selecting two or more authors. When viewing the article in both the blog card list and the detailed post view, all authors are displayed with their respective names and profile avatars.

**Acceptance Scenarios**:

1. **Given** an admin is creating or editing a blog post, **When** they select multiple authors from the author selector, **Then** all selected authors are linked to the post.
2. **Given** a blog post with multiple authors, **When** a visitor views the article on `/blog/[slug]`, **Then** all authors' avatars, names, and bio links are visibly presented in the author attribution section.
3. **Given** a blog post with exactly one author, **When** rendered on the blog index or detail view, **Then** the author layout gracefully displays the single author without awkward spacing or formatting bugs.

---

### User Story 3 - Admin Blog Management without Quiz Coupling (Priority: P3)

As an administrator, I want the blog admin interface to be clean and intuitive, free from confusing Quiz-specific fields such as "Quiz Lesson Slug" or "Fetch from Quiz", while retaining full search, filtering, and author management capabilities.

**Why this priority**: Streamlining the admin workflow reduces cognitive load, eliminates confusing error states from Quiz API sync failures, and provides a focused editorial experience.

**Independent Test**: An admin opens the blog management table and blog form; no Quiz references or buttons appear. All form inputs strictly relate to native blog properties (title, slug, summary, content, cover image, authors, tags/keywords).

**Acceptance Scenarios**:

1. **Given** an admin opens the blog creation or edit page, **When** inspecting the form fields, **Then** there are no "Fetch from Quiz" buttons, "Quiz Lesson Slug" fields, or Quiz status messages.
2. **Given** an admin fills out the form, **When** providing a custom slug or generating one from the title, **Then** the system validates slug uniqueness and saves the post without validating against the Quiz service.

---

### Edge Cases

- Legacy posts with empty content render a graceful placeholder alert ("Nội dung bài viết đang được cập nhật...") on the public reader view without throwing runtime errors or attempting to call the Quiz service.
- What happens if an admin tries to remove all authors from a blog post (should at least one author be mandatory, or can a post be anonymous/system-authored)?
- How does the system handle concurrent editing or conflicting slug generation when multiple admins create posts with identical titles?
- What happens to images and media embedded within the blog content (are they uploaded locally, hosted via CDN, or supported via external URLs)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST store and manage full article content natively within the application database, completely decoupled from the external Quiz service.
- **FR-002**: System MUST allow blog posts to have one or more associated authors.
- **FR-003**: System MUST provide a dedicated Markdown editor in the admin panel with formatting toolbar controls (bold, headings, code blocks, lists, links, images) and live preview support.
- **FR-004**: System MUST allow assigning one or more authors from existing internal system user accounts, storing and referencing them via their system user ID.
- **FR-005**: System MUST allow legacy blog posts with empty content to display a polite placeholder message ("Nội dung bài viết đang được cập nhật...") on the public reader page, allowing administrators to manually update article content via the admin panel without requiring an automated data migration script.
- **FR-006**: System MUST render all associated authors with their names and avatars on both the public blog list and article detail pages.
- **FR-007**: System MUST validate that article slugs are URL-friendly, unique, and editable by administrators.
- **FR-008**: System MUST remove all Quiz API fetching calls, routes (`/api/lessons/by-slug`), and client libraries that were previously used for blog content delivery.
- **FR-009**: System MUST support keyword/tag associations alongside multi-author attribution for content discoverability and filtering.

### Key Entities

- **Blog Post**: Represents a published or drafted article. Key attributes include title, slug, summary, full content, cover image, view count, published/created timestamp, and updated timestamp.
- **Author**: Represents a contributor to a blog post. Key attributes include identifier, display name, avatar URL, and optional profile/role description. A blog post can have many authors, and an author can write many blog posts.
- **Keyword / Tag**: Represents a topic or category associated with blog posts for categorization and filtering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Public blog detail pages (`/blog/[slug]`) load and render full article content in under 500ms without making any external network requests.
- **SC-002**: 100% of blog operations (create, read, update, delete, view) succeed independently of Quiz API availability or network status.
- **SC-003**: Admin users can write, assign multiple authors, preview, and publish a new blog post in under 3 minutes without encountering any Quiz-related fields or errors.
- **SC-004**: All articles with multiple authors clearly display all contributors on both desktop and mobile views with zero layout distortion.

## Assumptions

- Admin users already have authenticated access to the `/admin/blogs` route.
- The existing database infrastructure (PostgreSQL) has sufficient capacity to store full article content text.
- Authors can be represented using existing user accounts or a normalized author relationship table.
- Search indexing (full-text search) will incorporate the local blog content in addition to title and summary.
