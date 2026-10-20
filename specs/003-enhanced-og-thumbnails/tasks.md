# Tasks: Enhanced OpenGraph Thumbnails & Multi-Author Avatars

**Feature**: `003-enhanced-og-thumbnails`  
**Date**: 2026-10-15  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Status**: Completed  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Core asset loaders and utility modules for fonts, logos, and Vietnamese name processing.

- [X] T001 Create asset and font loader module in `frontend/lib/blog-thumbnail-assets.ts` loading `public/static/images/logo.png` as base64 data URL and `public/fonts/BeVietnamPro-Variable.ttf` as ArrayBuffer.
- [X] T002 [P] Implement Vietnamese name initial extractor & color hasher in `frontend/lib/vietnamese-names.ts` (handles Vietnamese naming order `tokens[tokens.length - 1]`, uppercase first letter, deterministic background color).
- [X] T003 [P] Unit test suite for Vietnamese name parsing and initials in `frontend/tests/unit/vietnamese-names.test.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and base image generation framework required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Create type definitions (`BlogAuthorInfo`, `BlogThumbnailOptions`) in `frontend/lib/blog-thumbnail-types.ts` supporting both structured author arrays and legacy `string[]`.
- [X] T005 Refactor core `createBlogThumbnail` generator in `frontend/lib/blog-thumbnail.tsx` to load embedded `BeVietnamPro` font and configure 1200x630 canvas.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Official Club Logo in OpenGraph Banner (Priority: P1) 🎯 MVP

**Goal**: Replace the generic placeholder in the thumbnail header with the official club logo from `public/static/images/logo.png`.

**Independent Test**: Request `/api/og/blog/preview?title=DUT+AI+Club` and verify the official mascot robot logo renders crisply in the top-left branding bar.

### Implementation for User Story 1

- [X] T006 [US1] Embed the official club logo (`logo.png`) into the header layout of `frontend/lib/blog-thumbnail.tsx` with proper 56x56 sizing and aspect ratio.
- [X] T007 [US1] Update preview route handler in `frontend/app/api/og/blog/preview/route.ts` to render the official logo header.

**Checkpoint**: User Story 1 complete and independently verifiable.

---

## Phase 4: User Story 2 - Multi-Author Avatars with Vietnamese Initial Fallback (Priority: P1)

**Goal**: Display individual avatar portraits for each author in a post, with automatic fallback to the initial letter of their Vietnamese first name (tên gọi).

**Independent Test**: Request an OG thumbnail with multiple authors (with and without avatar URLs) and verify that image avatars and fallback letter circles render cleanly in the footer area.

### Implementation for User Story 2

- [X] T008 [US2] Implement multi-author avatar cluster component in `frontend/lib/blog-thumbnail.tsx` displaying individual avatar circles (with fallback initials for missing images) and an overflow badge (`+N`) for >3 authors.
- [X] T009 [US2] Update `/api/og/blog/[slug]` route handler in `frontend/app/api/og/blog/[slug]/route.ts` to map `post.authors` with `name` and `avatar_url` into the thumbnail options.
- [X] T010 [US2] Update `/api/og/blog/preview` route handler in `frontend/app/api/og/blog/preview/route.ts` to accept structured author parameters (JSON array or repeated query params).
- [X] T011 [US2] Update Admin Blog Form in `frontend/app/admin/blogs/BlogForm.tsx` to pass author names and avatar URLs to the preview URL for live fidelity.

**Checkpoint**: User Stories 1 & 2 complete and independently verifiable.

---

## Phase 5: User Story 3 - High-Resolution & Crisp Social Previews across Platforms (Priority: P2)

**Goal**: Eliminate preview blurriness on social media feeds (Facebook, Zalo, Twitter/X, LinkedIn) through durable caching, complete metadata tags, and crisp typography.

**Independent Test**: Inspect HTTP headers for `Cache-Control: public, max-age=31536000, immutable` and verify presence of explicit `og:image:width`, `og:image:height`, `og:image:type`, and `twitter:card: summary_large_image` tags in blog HTML.

### Implementation for User Story 3

- [X] T012 [US3] Configure immutable caching headers (`Cache-Control: public, max-age=31536000, immutable`) on slug route in `frontend/app/api/og/blog/[slug]/route.ts`.
- [X] T013 [US3] Ensure full OpenGraph and Twitter card metadata tags (`og:image:width`, `og:image:height`, `og:image:type`, `twitter:card: summary_large_image`) in `frontend/app/blog/[...slug]/page.tsx` for both custom and generated images.
- [X] T014 [US3] Refine contrast, text shadows, line heights, and padding in `frontend/lib/blog-thumbnail.tsx` to prevent social media JPEG chroma subsampling degradation.

**Checkpoint**: All user stories complete and functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, end-to-end testing, and cleanup across the feature.

- [X] T015 Execute end-to-end quickstart validation scenarios defined in `specs/003-enhanced-og-thumbnails/quickstart.md`.
- [X] T016 Run lint and TypeScript type checking across `frontend/` to ensure zero compilation or formatting errors.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Completed.
- **Foundational (Phase 2)**: Completed.
- **User Story 1 (Phase 3)**: Completed.
- **User Story 2 (Phase 4)**: Completed.
- **User Story 3 (Phase 5)**: Completed.
- **Polish (Phase 6)**: Completed.

### Parallel Opportunities Executed

- T002 & T003 ran in parallel with T001.
- T009 & T010 implemented in parallel.
- Type check and unit tests verified cleanly.
