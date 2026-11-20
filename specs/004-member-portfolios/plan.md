# Implementation Plan: Member Portfolio Profiles

**Branch**: `004-member-portfolios` | **Date**: 2026-11-20 | **Spec**: [specs/004-member-portfolios/spec.md](file:///Users/nguyenhuynh/Documents/projects/dut-ai-web/specs/004-member-portfolios/spec.md)

**Input**: Feature specification from `specs/004-member-portfolios/spec.md`

## Summary

Build a dynamic, multi-user portfolio system integrated directly into `dut-ai-web`. Every active club member receives a public profile at `/members/[username]`. The system adapts the section structure of the reference portfolio (`my-cv`: Hero, About, Skills, Projects, CV) converted cleanly into Next.js 16 Server Components with Tailwind CSS v4 and full Dark/Light theme support. Data is persisted in PostgreSQL via Drizzle ORM, PDF resumes are managed via MinIO object storage, and verified club projects are automatically aggregated from the existing `projects` & `project_members` tables.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js 20+

**Primary Dependencies**: Next.js 16.3.1 (App Router), React 19.2.4, Drizzle ORM 0.45.2, PostgreSQL (`postgres` client 3.4.9), `@aws-sdk/client-s3` (MinIO), Tailwind CSS 4.1.18, `lucide-react`, `motion` (Framer Motion 13.2), `zod` 4.6.7

**Storage**: PostgreSQL 16 (Drizzle schema: `user_cv` extended / `user_portfolio_projects`), MinIO Object Storage (bucket `dut-ai-manager-prod` / folder `resumes`)

**Testing**: Unit tests, schema migration verification (`drizzle-kit generate`), lint/type check (`npm run lint`), responsive & theme verification

**Target Platform**: Modern Web Browsers (Desktop & Mobile, Chrome/Firefox/Safari/Edge), Node.js server runtime

**Project Type**: Fullstack Web Application (Next.js App Router + PostgreSQL + MinIO)

**Performance Goals**: Public portfolio page LCP < 1.5s, cumulative layout shift (CLS) < 0.1, 60fps smooth transitions, zero client-side hydration errors

**Constraints**:
- Strictly follow DUT-AI design guidelines: dark/light theme tokens, no unapproved purple/violet neon colors, no Bootstrap CSS leakage.
- Strict TypeScript with zero `any` types.
- URL-safe, lowercase usernames with collision resistance and system keyword reservation.
- Max CV upload size: 10MB (PDF mime type only).

**Scale/Scope**: ~100+ active club members, unlimited public visitors, scalable to 10k+ portfolio page views/month.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Compliance Status | Analysis & Evidence |
| :--- | :--- | :--- |
| **I. Clean Code & Simplicity** | PASS | Reuses existing Drizzle ORM, MinIO client, and Tailwind v4 design tokens. No new heavy dependencies like `react-tsparticles` or `react-pdf`. |
| **II. Technology-Agnostic Spec** | PASS | `spec.md` focuses purely on user journeys, testable functional requirements, and measurable outcomes. |
| **III. Testable Slices (MVP first)** | PASS | Prioritized stories P1 (Public viewer) -> P2 (Edit/CV upload) -> P3 (Club project sync) -> P4 (Directory integration). |
| **IV. Security & Input Validation** | PASS | Usernames strictly validated against regex `^[a-z0-9_-]{3,30}$` and reserved route blocklist. File upload validated for PDF headers and 10MB limit. |
| **V. Design & Brand Integrity** | PASS | Strictly respects DUT-AI theme system, rejects Bootstrap CSS and unvetted styles to prevent UI pollution. |

## Project Structure

### Documentation (this feature)

```text
specs/004-member-portfolios/
├── spec.md                  # Feature Specification
├── plan.md                  # This implementation plan
├── research.md              # Phase 0: Technical choices, architectural research & decisions
├── data-model.md            # Phase 1: Database schemas, Drizzle models & entity definitions
├── quickstart.md            # Phase 1: Verification, test steps, and local reproduction guide
├── checklists/
│   └── requirements.md      # Spec Quality Checklist
└── contracts/               # Phase 1: Interface & API contracts
    ├── portfolio-api.md     # HTTP API specifications
    └── ui-contracts.md      # UI components & props contracts
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (public)/
│   │   └── members/
│   │       └── [username]/
│   │           ├── page.tsx             # Public portfolio Server Component (SSR/dynamic metadata)
│   │           ├── not-found.tsx        # 404 page for missing username
│   │           └── loading.tsx          # Skeleton loader
│   ├── admin/
│   │   └── portfolio/
│   │       └── page.tsx                 # Member portfolio management dashboard & editor
│   └── api/
│       └── members/
│           ├── [username]/route.ts      # Public GET portfolio profile API
│           ├── me/
│           │   ├── portfolio/route.ts   # Authenticated GET/PUT personal portfolio
│           │   ├── cv/route.ts          # Authenticated POST/DELETE PDF CV upload
│           │   └── projects/route.ts    # Authenticated CRUD personal projects
├── components/
│   ├── portfolio/
│   │   ├── PortfolioHero.tsx            # Intro, avatar, headline, quick contact
│   │   ├── PortfolioAbout.tsx           # Bio, social links, stats
│   │   ├── PortfolioSkills.tsx          # Categorized skill badges
│   │   ├── PortfolioProjects.tsx        # Club & personal project grid
│   │   ├── PortfolioResume.tsx          # PDF CV inline viewer & download action
│   │   └── PortfolioProjectCard.tsx     # Card component for project item
│   ├── admin/portfolio/
│   │   ├── PortfolioEditForm.tsx        # Form for bio, username, skills, social links
│   │   ├── CvUploader.tsx               # Drag & drop PDF resume upload with progress
│   │   └── PersonalProjectsManager.tsx  # Modal/list to add/edit personal projects
│   └── about/
│       └── GenerationAlbum.tsx          # Updated to link member cards to /members/[username]
├── lib/
│   ├── db/
│   │   └── features/
│   │       └── users/
│   │           ├── schema.ts            # Extended user_cv & new user_portfolio_projects
│   │           ├── queries.ts           # DB queries for portfolio fetch, upsert, project sync
│   │           └── types.ts             # TypeScript interfaces for portfolio models
│   └── portfolio/
│       ├── username-generator.ts        # Algorithmic username generator & slugifier
│       └── reserved-usernames.ts        # Blocklist of system keywords
└── drizzle/
    └── 0006_member_portfolios.sql       # Database migration script
```

**Structure Decision**: Integrated directly into the existing `frontend/` directory structure under Next.js App Router, extending `lib/db/features/users/` and adding `components/portfolio/`. This avoids creating unnecessary micro-packages while keeping database operations cleanly co-located with existing user features.

## Complexity Tracking

| Decision / Pattern | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| Native PDF Embed (`<object>` / `<iframe>` + Direct Download) | Zero-bundle-size PDF viewing compatible with Next.js 16 SSR & React 19. | `react-pdf` rejected because it has broken peer dependencies on React 19, pulls legacy workers via external CDN, and bloats bundle size by > 400KB. |
| Hybrid Project Query (`project_members` + `user_portfolio_projects`) | Gives users official club credibility while allowing them to showcase personal hackathon/hobby projects. | Showing only club projects limits user freedom; showing only manual projects loses the advantage of having club data. |
| Separate `user_portfolio_projects` table | Allows 1-N personal projects with dedicated URLs, thumbnails, and descriptions without JSON array mutation race conditions. | Storing personal projects as a JSON blob inside `user_cv` makes index-searching and granular updates error-prone. |
