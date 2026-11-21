# Implementation Plan: My-CV Portfolio Redesign & Interactive Adaptation

**Branch**: `011-my-cv-portfolio-redesign` | **Date**: 2026-11-21 | **Spec**: [specs/011-my-cv-portfolio-redesign/spec.md](./spec.md)

**Input**: Feature specification from `specs/011-my-cv-portfolio-redesign/spec.md`

## Summary

Modernize and adapt the visual design, interactive effects, and section layout of the `my-cv` template to the member portfolio view (`/members/[username]`) within DUT-AI Web. Replaces the generic SaaS layout with `my-cv`'s signature aesthetic: deep cosmos dark gradient, starry particle canvas background, dynamic typewriter effect, visual Techstack & Toolstack icon grids, interactive GitHub Activity Calendar ("Days I Code"), showcase project cards with GitHub/Live Demo buttons, and dedicated Resume preview & download. Re-themes all accent highlights to DUT-AI brand blue (`#2563eb`) while binding dynamically to PostgreSQL database models with zero React 19 hydration issues.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Next.js 16.3 (Turbopack, App Router)

**Primary Dependencies**: Tailwind CSS v4, Lucide React, motion, next-themes

**Storage**: PostgreSQL via Drizzle ORM (`users`, `user_cv`, `user_portfolio_projects`, `projects`, `project_members`)

**Testing**: Jest unit tests, integration tests (`tests/integration`), Playwright E2E (`tests/e2e`)

**Target Platform**: Modern web browsers (Desktop, Tablet, Mobile) with dark/light mode and reduced-motion accessibility

**Project Type**: Full-stack Next.js web application (Decoupled architecture)

**Performance Goals**: 60 FPS particle animation, LCP < 2.5s, 0 layout shifts (CLS < 0.1)

**Constraints**: Zero raw `<img>` tags (Next.js `<Image />` mandate), zero React 19 hydration mismatch errors, strict Vertical Slice colocation under `frontend/features/portfolio/`

**Scale/Scope**: All active members of DUT-AI Club (100+ public portfolio profiles)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I: Architecture & Separation of Concerns (Vertical Slice)**: All portfolio components, helpers, and types colocated under `frontend/features/portfolio/`.
- [x] **Principle II: RBAC & Identity-First Security**: Public profile viewing respects `isPublic` status; no private tokens or secrets exposed.
- [x] **Principle III: Clean Code & Modern Standards**: Strictly adheres to Next.js `<Image />` mandate, `useSyncExternalStore` / client-side isolation for DOM APIs, zero Bootstrap collision.
- [x] **Principle IV: Verification, Testing & Quality Gates**: Supported by Unit and Integration test coverage; zero dev DB pollution.
- [x] **Principle V: Resilience & Performance**: Canvas particle loop respects `requestAnimationFrame` and `prefers-reduced-motion`; GitHub API failures gracefully handled.

## Project Structure

### Documentation (this feature)

```text
specs/011-my-cv-portfolio-redesign/
├── plan.md              # This file
├── research.md          # Phase 0: Technology selection & adaptation
├── data-model.md        # Phase 1: Data models and domain contracts
├── quickstart.md        # Phase 1: Development and verification steps
├── contracts/           # Phase 1: Component interfaces and types
│   └── portfolio-components.ts
└── tasks.md             # Phase 2: Actionable tasks (generated via /speckit-tasks)
```

### Source Code Layout

```text
frontend/
├── app/
│   └── members/
│       └── [username]/
│           ├── page.tsx          # Server Component: fetches portfolio data and renders layout
│           ├── not-found.tsx     # 404 handler for non-existent/private members
│           └── loading.tsx       # Loading skeleton matching cosmos theme
├── features/
│   └── portfolio/
│       ├── components/
│       │   ├── PortfolioParticles.tsx   # Client canvas starry particles
│       │   ├── PortfolioHero.tsx        # Hero with Typewriter & Tilt avatar
│       │   ├── PortfolioAbout.tsx       # Bio card, Techstack, Toolstack & GitHub Calendar
│       │   ├── PortfolioProjects.tsx    # Project showcase cards (GitHub + Demo)
│       │   ├── PortfolioResume.tsx      # CV download action & preview
│       │   ├── GithubCalendar.tsx       # Blue-themed GitHub activity graph
│       │   └── TechIcons.tsx            # SVG tech & tool icon resolver
│       └── hooks/
│           ├── useTypewriter.ts         # Lightweight pure-React typewriter hook
│           └── useMouseTilt.ts          # Smooth 3D tilt tracking hook
└── tests/
    └── unit/
        └── portfolio-components.test.tsx
```

## Implementation Phases

### Phase 0: Research & Core Utilities
- Finalize lightweight `PortfolioParticles` canvas engine.
- Create zero-dependency `useTypewriter` hook.
- Implement `TechIcons.tsx` resolver for rendering programming language and tool badges.

### Phase 1: Redesign Hero, About, Techstack & Tools
- Redesign `PortfolioHero.tsx` with starry cosmos backdrop, "Hi There! 👋" heading, animated typewriter, and social links.
- Redesign `PortfolioAbout.tsx` with structured biography card, quote footer, and responsive Techstack and Toolstack icon grids.
- Implement `GithubCalendar.tsx` fetching contribution data and styling with `#2563eb` gradient shades.

### Phase 2: Showcase Projects & Resume
- Redesign `PortfolioProjects.tsx` with `my-cv` card aesthetics: thumbnail banner, project title, role tag, description, tech stack pills, and GitHub / Live Demo buttons.
- Update `PortfolioResume.tsx` with prominent download buttons and clean document preview.

### Phase 3: Assembly, Polish & Validation
- Wire components together in `app/members/[username]/page.tsx`.
- Add responsive styling for mobile/tablet.
- Validate with `npm run test:unit`, TypeScript check (`tsc --noEmit`), and ESLint.
