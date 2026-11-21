# Implementation Plan: Feature-Driven / Modular Architecture Refactoring

**Branch**: `007-feature-driven-architecture` | **Date**: 2026-11-21 | **Spec**: [specs/007-feature-driven-architecture/spec.md](spec.md)

**Input**: Feature specification from `/specs/007-feature-driven-architecture/spec.md`

## Summary

Refactor the Next.js frontend into a modern, enterprise-grade **Feature-Driven / Modular Architecture**. Bounded business domains (`blog`, `projects`, `events`, `portfolio`, `generations`, `auth`) are encapsulated into `frontend/features/<domain>/`. Shared components are organized into `components/ui/` (primitives), `components/layout/` (shells), and `components/common/`. Legacy artifacts (`app/api-client.ts`, standalone `layouts/`) are fully modernized and absorbed, ensuring 100% build health, zero runtime regressions, and high developer velocity.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+, Next.js 15+ (App Router)  
**Primary Dependencies**: React 19, Tailwind CSS v4, Lucide React, Radix UI, Drizzle ORM  
**Storage**: PostgreSQL 16 (Drizzle ORM), MinIO S3 Object Storage  
**Testing**: Jest / Vitest, `npx tsc --noEmit`, Next.js production build (`npm run build`)  
**Target Platform**: Web (Modern desktop and mobile browsers), Docker Linux server  
**Project Type**: Full-Stack Decoupled Web Application (Next.js App Router + Wagtail Headless Backend)  
**Performance Goals**: Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), zero increase in bundle size  
**Constraints**: Zero breaking changes to public URLs, REST endpoints, Server Actions, or RBAC security guards  
**Scale/Scope**: 34 Next.js routes, 6 business features, ~60 relocated files, strict TypeScript checking  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Architecture & Separation of Concerns**: PASSED. Next.js App Router remains decoupled from backend Wagtail CMS; routing boundaries remain clean.
- **Principle II: RBAC & Identity-First Security**: PASSED. All auth and partition logic (`Content` vs `Portfolio`) is strictly preserved under `features/auth` and `features/portfolio`.
- **Principle III: Clean Code & Modern Standards**: PASSED. Eliminates 20+ flat files in `components/`, modernizes `layouts/`, and places helper utilities in `lib/`.
- **Principle IV: Verification, Testing & Quality Gates**: PASSED. Plan includes automated TypeScript checking (`tsc --noEmit`), linting, and full production build verification.
- **Principle V: Resilience, Observability & Performance**: PASSED. Zero change to runtime timeouts, network boundaries, or error boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/007-feature-driven-architecture/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Architectural decisions & boundary rationale
├── data-model.md        # File relocation matrix and new directory tree
├── quickstart.md        # Automated & manual verification guide
├── contracts/
│   └── module-contracts.md # Allowed import hierarchy & path aliases
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code Layout

```text
frontend/
├── app/                 # Routing, metadata & page shells
├── features/            # Bounded Business Domains
│   ├── auth/            # Login, SSO context, User menu, RBAC
│   ├── blog/            # Blog views, MDX, Editor, Notion import, ToC
│   ├── events/          # Events list, Workshop cards, Timeline, Photos
│   ├── generations/     # Generations album, Member detail modal
│   ├── portfolio/       # Portfolio preview, Editor, Username generator
│   └── projects/        # Project list client & project cards
├── components/          # Shared Design System & Layouts
│   ├── ui/              # Shadcn UI primitives (button, card, dialog, badge)
│   ├── layout/          # Header, Footer, MobileNav, ThemeSwitch, LayoutWrapper
│   ├── common/          # Shared widgets (CopyButton, DutaiWaffle, SparkleIcon)
│   ├── home/            # Home landing sections (Hero, Moments, Roadmap)
│   └── about/           # About landing sections (Story, Values, Activities)
└── lib/                 # Core Infrastructure
    ├── api-client.ts    # Centralized API fetcher (moved from app/)
    ├── api.ts           # Backend integration
    ├── db/              # Drizzle ORM client, schemas, queries
    ├── minio.ts         # Object storage
    ├── types.ts         # Global types
    └── utils.ts         # Utility helpers
```
