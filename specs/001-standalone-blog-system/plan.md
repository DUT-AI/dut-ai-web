# Implementation Plan: Standalone Blog Management System with Multi-Author Support

**Branch**: `001-standalone-blog-system` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-standalone-blog-system/spec.md`

---

## Summary

Decouple the DUT-AI blog management module completely from the external Quiz API service (`quiz.dutai.site`). Restore direct persistence of Markdown article content in PostgreSQL via Drizzle ORM (`blogs.content`), build an integrated Markdown Editor with toolbar and live preview in the Admin dashboard, maintain robust multi-author attribution from internal user accounts, and serve blog articles natively without external network latency or single-point-of-failure risks.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+ / React 19.x  
**Primary Dependencies**: Next.js 16 (App Router), Drizzle ORM (`drizzle-orm`, `drizzle-kit`), Postgres.js, `@tailwindcss/typography`, `next-mdx-remote`, `lucide-react`, `marked` / `react-markdown`  
**Storage**: PostgreSQL (Docker container / managed RDS), MinIO (S3-compatible asset storage for cover & content images)  
**Testing**: Manual E2E validation scenarios via [quickstart.md](./quickstart.md), linting via `npm run lint`  
**Target Platform**: Node.js / Docker container on Linux/macOS  
**Project Type**: Full-stack Web Application (`frontend/` Next.js + `backend/` auxiliary services)  
**Performance Goals**: Public blog article page load < 500ms, zero external third-party API dependencies during page render  
**Constraints**: Zero downtime on Quiz API failures, internal-only author user accounts, backwards compatibility for legacy posts without local content  
**Scale/Scope**: ~100-500 blog posts, 1-5 authors per post, full-text search capability  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Assessment | Status |
|---|---|---|
| **Independence & Reliability** | Completely eliminates external runtime network dependency on `quiz.dutai.site`. | **PASS** |
| **Data Integrity & Normalization** | Relies on PostgreSQL relational structure (`blogs`, `blog_authors`, `users`). | **PASS** |
| **User Experience & Editorial Flow** | Direct in-app Markdown authoring with live preview replaces disconnected Quiz workflow. | **PASS** |
| **Clean Architecture** | Clean separation of Drizzle schema, query helpers, server actions, and UI components. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-standalone-blog-system/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (architectural decisions & research)
├── data-model.md        # Phase 1 output (ERD & schema definitions)
├── quickstart.md        # Phase 1 output (runnable validation guide)
├── contracts/           # Phase 1 output (interface contracts)
│   ├── admin-blog-actions.md
│   └── blog-queries.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (affected paths)

```text
frontend/
├── app/
│   ├── (public)/
│   │   └── blog/
│   │       ├── page.tsx                             # Public blog listings
│   │       └── [...slug]/
│   │           └── page.tsx                         # Public blog detail (decoupled from Quiz)
│   ├── admin/
│   │   └── blogs/
│   │       ├── actions.ts                           # Server actions for saving/deleting blogs
│   │       ├── BlogForm.tsx                         # Admin Blog Form with Markdown Editor
│   │       ├── page.tsx                             # Admin blog management table
│   │       ├── create/page.tsx                      # Create blog page
│   │       └── [id]/edit/page.tsx                   # Edit blog page
│   └── api/
│       └── lessons/by-slug/                         # DEPRECATED/REMOVED Quiz proxy route
├── components/
│   └── admin/
│       └── MarkdownEditor.tsx                       # Dedicated Markdown Editor + Live Preview component
├── lib/
│   ├── db/
│   │   └── features/
│   │       └── blogs/
│   │           ├── schema.ts                        # Drizzle schema with restored `content`
│   │           ├── types.ts                         # Updated Blog types (with `content`)
│   │           └── queries.ts                       # Blog queries reading native `content`
│   └── quiz-client.ts                               # DEPRECATED/REMOVED Quiz client for blogs
└── drizzle/
    └── 0004_restore_blog_content.sql                # Drizzle migration adding content column
```

**Structure Decision**:
The implementation resides primarily in `frontend/` where Next.js App Router and Drizzle ORM directly manage the database, admin actions, and public views. Auxiliary cleanup removes obsolete Quiz proxy routes and client files.

---

## Complexity Tracking

*No constitutional violations identified. Standard Next.js + Drizzle ORM architectural patterns applied.*
