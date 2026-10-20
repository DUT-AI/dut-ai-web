# Phase 0: Technical Research & Architectural Decisions

**Feature**: Standalone Blog Management System with Multi-Author Support (`001-standalone-blog-system`)  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Context & Architectural Overview

The DUT-AI web application currently uses Next.js (App Router, React 19, TypeScript), PostgreSQL, and Drizzle ORM. Previously, the `content` column of the `blogs` table was dropped (`0001_delete_content_in_blog.sql`), and article content was fetched at runtime from an external Quiz API service (`quiz.dutai.site`) via `fetchLessonBySlugFromQuiz(post.slug)`.

This design introduced several operational liabilities:
1. **Coupling & Fragility**: If `quiz.dutai.site` is slow or down, the blog reader view breaks or returns 502.
2. **Confusing Admin UX**: Content creators in `/admin/blogs` had to input a Quiz lesson slug, test fetching from Quiz, and could not write native articles directly.
3. **Limited Autonomy**: DUT-AI articles could not be authored, revised, or previewed independently.

In this feature, we restore full self-hosting and autonomy to the blog module while retaining and polishing multi-author capabilities.

---

## 2. Research Findings & Decision Matrix

### Decision 1: Database Schema & Column Restoration

- **Decision**: Add `content: text('content')` column back to the `blogs` table in `frontend/lib/db/features/blogs/schema.ts` and generate a Drizzle Kit migration.
- **Rationale**:
  - `text` in PostgreSQL supports arbitrary-length Markdown documents (tens of thousands of lines) without performance degradation.
  - Matches previous column definition before it was dropped in `0001_delete_content_in_blog.sql`.
  - Full-text search vector (`search_vector`) can eventually index `title`, `summary`, and `content`.
- **Alternatives Considered**:
  - *Storing content in MinIO / S3 object storage as `.md` files*: Rejected because it adds an unnecessary storage dependency, complicates transactional edits and rollbacks, and prevents database-level full-text search.
  - *Storing structured JSON (AST)*: Rejected because the user explicitly chose Markdown with Live Preview, and existing rendering in `frontend/app/blog/[...slug]/page.tsx` uses `next-mdx-remote` / remark / rehype Markdown processing.

---

### Decision 2: Admin Markdown Editor Architecture

- **Decision**: Implement a dedicated, lightweight Markdown Editor component with toolbar shortcuts, live tab/split preview, and MinIO image paste/upload integration.
- **Rationale**:
  - The project already has `@tailwindcss/typography`, `lucide-react`, `next-themes`, and Markdown parsing utilities (`marked`, `react-markdown`).
  - No bloated external WYSIWYG bundle (e.g. TipTap, Quill) needed.
  - Allows easy insertion of headings, bold, italic, code blocks, bullet points, links, and uploaded image URLs.
- **Alternatives Considered**:
  - *Monaco Editor / CodeMirror*: High bundle size (>2MB) and unnecessary IDE features for standard blog editing.
  - *Simple unstyled textarea*: Poor UX for content authors who need formatting shortcuts and live preview.

---

### Decision 3: Multi-Author Management & Data Integrity

- **Decision**: Keep the `blog_authors` junction table (`blog_id`, `external_user_id` / `user_id`) linking to the existing `users` table, supporting 1 or more authors per article.
- **Rationale**:
  - The database already contains the `blog_authors` table with a composite primary key `(blog_id, user_id)` (aliased as `external_user_id` in drizzle schema).
  - Admin form already passes `authorIds` via `FormData.getAll('authorIds')`.
  - `getManageUsersMap()` in `frontend/lib/manage-users.ts` already resolves users, names, and avatars.
  - The user confirmed in `speckit-clarify` (Session 2026-10-14) that authors must be internal users.
- **Alternatives Considered**:
  - *Single author column (`author_id` on `blogs`)*: Rejected because requirement explicitly mandates multi-author support.
  - *Separate Guest Authors table*: Rejected based on user clarification.

---

### Decision 4: Complete Quiz Service Decoupling

- **Decision**:
  1. Remove `fetchLessonBySlugFromQuiz` call from `frontend/app/blog/[...slug]/page.tsx`.
  2. Remove `quizPreview`, `handleFetchFromQuiz`, and Quiz API slug helpers from `frontend/app/admin/blogs/BlogForm.tsx`.
  3. Deprecate/remove `/api/lessons/by-slug/[slug]/route.ts` and `frontend/lib/quiz-client.ts`.
  4. Remove `QUIZ_API_BASE_URL` and `QUIZ_API_KEY` requirements from blog documentation and runtime checks.
- **Rationale**: Total decoupling guarantees 100% independence, eliminates third-party network calls on public reader pages, and reduces system attack surface.
- **Alternatives Considered**:
  - *Keeping Quiz as a fallback if `content` is empty*: Rejected because the user specifically requested completely removing the Quiz fetching integration and allowing legacy posts to display a friendly placeholder message while admins manually update them.

---

### Decision 5: Legacy Post Transition Strategy

- **Decision**: Provide a graceful placeholder view (`*Nội dung bài viết đang được cập nhật...*`) when `post.content` is null or empty.
- **Rationale**:
  - Aligns with the user's explicit decision in `speckit-clarify` (Option B: Manual Update).
  - Legacy posts will not trigger 404 or 500 errors; reader sees metadata, authors, keywords, and the placeholder.
  - Admins can simply open each existing post in `/admin/blogs/[id]/edit`, paste or write the content in the Markdown editor, and save.

---

## 3. Best Practices & Security Considerations

1. **Markdown XSS Protection**:
   - `compileMDX` in `frontend/app/blog/[...slug]/page.tsx` utilizes `rehype` and `remark` plugins. Ensure HTML sanitization or non-executing component bindings are preserved so malicious raw HTML injected via Markdown cannot execute arbitrary scripts.
2. **Slug Validation**:
   - Slug must remain unique (`ix_blogs_slug`).
   - Admin action validates slug format (lowercase alphanumeric + hyphens).
3. **Database Performance**:
   - Blog detail query `getBlogBySlug(slug)` uses indexed lookup (`ix_blogs_slug`).
   - Junction queries for `blogAuthors` and `blogKeywords` are eager-loaded via Drizzle relational query API with minimal roundtrips.
