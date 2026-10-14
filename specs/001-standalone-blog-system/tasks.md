# Tasks: Standalone Blog Management System with Multi-Author Support

**Input**: Design artifacts from `specs/001-standalone-blog-system/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema restoration and data type definitions

- [x] T001 Restore `content: text('content')` column on `blogs` table in `frontend/lib/db/features/blogs/schema.ts`
- [x] T002 [P] Update TypeScript interfaces (`Blog`, `CreateBlogInput`, `UpdateBlogInput`) with `content?: string | null` in `frontend/lib/db/features/blogs/types.ts`
- [x] T003 Push schema changes to PostgreSQL database via Drizzle Kit (`cd frontend && npx drizzle-kit push`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data queries, server actions, and editor UI component required by user stories

- [x] T004 Update database query functions (`createBlogQuery`, `updateBlogQuery`, and `mapBlog`) to insert, update, and select `content` in `frontend/lib/db/features/blogs/queries.ts`
- [x] T005 [P] Create reusable `MarkdownEditor` component with formatting toolbar, code snippet insertion, and live preview in `frontend/components/admin/MarkdownEditor.tsx`
- [x] T006 [P] Update Server Action `saveBlogAction` in `frontend/app/admin/blogs/actions.ts` to parse `content`, validate unique slug, and revalidate cache tags

---

## Phase 3: User Story 1 - Create and Manage Independent Blog Posts (Priority: P1) 🎯 MVP

**Goal**: Deliver fully standalone blog reading and authoring where articles are stored locally in the database and rendered without calling the external Quiz API.

**Independent Test**: An admin creates an article with title, summary, and Markdown content. Visiting `/blog/[slug]` renders the complete article with 0 requests to `quiz.dutai.site`.

- [x] T007 [US1] Update public blog detail page in `frontend/app/blog/[...slug]/page.tsx` to read `post.content` directly and remove `fetchLessonBySlugFromQuiz`
- [x] T008 [US1] Add graceful fallback placeholder ("*Nội dung bài viết đang được cập nhật...*") in `frontend/app/blog/[...slug]/page.tsx` when `post.content` is null or empty
- [x] T009 [US1] Update blog query helper `getBlogBySlug` in `frontend/lib/db/features/blogs/queries.ts` to ensure `content` is retrieved alongside author relations

---

## Phase 4: User Story 2 - Multi-Author Attribution and Collaboration (Priority: P2)

**Goal**: Support associating 1 or more internal authors to a single blog post and display all contributors consistently.

**Independent Test**: Create or edit a blog post selecting 2 authors. Both author names and avatars appear in the article header on `/blog/[slug]` and in author chips on `/blog`.

- [x] T010 [P] [US2] Ensure multi-author relation syncing in `createBlogQuery` and `updateBlogQuery` in `frontend/lib/db/features/blogs/queries.ts` manages `blog_authors` junction records correctly
- [x] T011 [P] [US2] Update author selection UI in `frontend/app/admin/blogs/BlogForm.tsx` to support searching, toggling, and multi-selecting internal user accounts
- [x] T012 [US2] Verify and polish multi-author attribution layout on public detail page `frontend/app/blog/[...slug]/page.tsx` and blog listing cards

---

## Phase 5: User Story 3 - Admin Blog Management without Quiz Coupling (Priority: P3)

**Goal**: Clean up the admin blog authoring interface to eliminate all Quiz-specific inputs and provide an intuitive Markdown editor experience.

**Independent Test**: Open `/admin/blogs/create` and `/admin/blogs/[id]/edit`. All Quiz references ("Slug bài học", "Tìm nạp từ Quiz") are gone, replaced by the Markdown editor and preview.

- [x] T013 [US3] Integrate `MarkdownEditor` into `frontend/app/admin/blogs/BlogForm.tsx`, binding it to form state and hidden input for server action submission
- [x] T014 [US3] Remove Quiz slug input, "Tìm nạp từ Quiz" button, `fetchingQuiz` state, and `quizPreview` box from `frontend/app/admin/blogs/BlogForm.tsx`
- [x] T015 [P] [US3] Update admin blog create page header and description text in `frontend/app/admin/blogs/create/page.tsx`
- [x] T016 [P] [US3] Update admin blog edit page header and description text in `frontend/app/admin/blogs/[id]/edit/page.tsx`
- [x] T017 [P] [US3] Update admin blog table list header and descriptions in `frontend/app/admin/blogs/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup obsolete Quiz services, verify code quality, and validate end-to-end functionality.

- [x] T018 [P] Delete obsolete Quiz API proxy route `frontend/app/api/lessons/by-slug/[slug]/route.ts`
- [x] T019 [P] Remove `fetchLessonBySlugFromQuiz` and deprecate Quiz client in `frontend/lib/quiz-client.ts`
- [x] T020 [P] Clean up Quiz environment variable references in `frontend/.env.example`
- [x] T021 Run ESLint and TypeScript compilation checks across `frontend/` (`npm run lint`)
- [x] T022 Execute [quickstart.md](./quickstart.md) validation scenarios to verify end-to-end blog lifecycle

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately. Blocks Phase 2.
- **Foundational (Phase 2)**: Depends on Phase 1 completion. Blocks all User Stories.
- **User Story 1 (Phase 3 - MVP)**: Depends on Phase 2. Delivers standalone reading and direct content persistence.
- **User Story 2 (Phase 4)**: Depends on Phase 2. Delivers multi-author assignment and attribution.
- **User Story 3 (Phase 5)**: Depends on Phase 2 and integrates with US1/US2 in `BlogForm.tsx`.
- **Polish (Phase 6)**: Runs after User Stories 1-3 are implemented.

### Parallel Opportunities

- Within Phase 1: `T002` can be completed in parallel with `T001`.
- Within Phase 2: `T005` (MarkdownEditor component) and `T006` (Server Action) can proceed in parallel once `T004` establishes query signatures.
- Within Phase 4: `T010` (query sync) and `T011` (author selector UI) can proceed in parallel.
- Within Phase 5: `T015`, `T016`, `T017` (page text updates) can run in parallel.
- Within Phase 6: `T018`, `T019`, `T020` (Quiz cleanup) can run in parallel.

---

## Implementation Strategy

### MVP Delivery (User Story 1)

1. Complete Setup (T001-T003) & Foundational (T004-T006).
2. Complete User Story 1 (T007-T009).
3. **Validate MVP**: Articles can be created with content in DB and read publicly with zero Quiz API interaction.
4. Continue with Multi-Author Attribution (US2), Admin Form Polish (US3), and Final Cleanup (Phase 6).
