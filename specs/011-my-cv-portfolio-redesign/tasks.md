# Tasks: My-CV Portfolio Redesign & Interactive Adaptation

**Input**: Design documents from `specs/011-my-cv-portfolio-redesign/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for hooks and components under `frontend/tests/unit/`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths are specified in descriptions

---

## Phase 1: Setup (Shared Infrastructure, Packages & Helpers)

**Purpose**: Dependencies, core animations, canvas particle engine, and utility hooks

- [x] T001 [P] Install tested React 19 UI packages (`react-parallax-tilt`, `typewriter-effect`, `react-github-calendar`) in `frontend/package.json`
- [x] T002 [P] Create `frontend/features/portfolio/hooks/useTypewriter.ts` implementing client-side typewriter rotation with blinking cursor
- [x] T003 [P] Create `frontend/features/portfolio/components/PortfolioParticles.tsx` implementing lightweight HTML5 canvas starry particle background with 60 FPS animation loop and `prefers-reduced-motion` support
- [x] T004 [P] Create `frontend/features/portfolio/components/TechIcons.tsx` resolving database technology and tool names to modern SVG icons with glowing hover styles

---

## Phase 2: Foundational (Design Tokens & Shared Layout)

**Purpose**: Shared styling tokens, dark cosmos theme (`#0c0513`), and DUT-AI Blue accent (`#2563eb`)

- [x] T005 Define shared CSS module / Tailwind utilities for the cosmos dark theme in `frontend/features/portfolio/portfolio.module.css`
- [x] T006 Setup unit tests in `frontend/tests/unit/portfolio-logic.test.ts` for typewriter, tab definitions, and GitHub username sanitization

**Checkpoint**: Core animation infrastructure and hooks verified - ready for tab and component implementation.

---

## Phase 3: User Story 1 - Portfolio Tab Navigation & "My-CV" Navbar (Priority: P1) 🎯 MVP

**Goal**: Deliver the dedicated glassmorphic Navbar with tabs: **Home**, **About**, **Projects**, **Resume**, supporting instant switching, URL query params (`?tab=...`), and mobile drawer.

**Independent Test**: Navigate to `/members/[username]` and click between tabs to confirm view switching, active tab indicators, and URL hash/query sync.

- [x] T007 [P] [US1] Create unit test in `frontend/tests/unit/portfolio-logic.test.ts` verifying tab structure and routing
- [x] T008 [US1] Implement `frontend/features/portfolio/components/PortfolioNavbar.tsx` with:
  - Sticky glassmorphic bar (`backdrop-blur-md bg-[#0c0513]/85 border-b border-blue-500/20`)
  - Member brand initials/name
  - Tab items: `Home` (🏠), `About` (👤), `Projects` (💻), `Resume` (📄) with active DUT-AI Blue badge
  - Mobile hamburger toggle and dropdown menu
  - Back-to-club portal link (`DUT AI Club`)
- [x] T009 [US1] Implement `frontend/features/portfolio/components/PortfolioContainer.tsx` orchestrating tab states, deep-linking (`useSearchParams`), and transition animations

**Checkpoint**: Tab navigation works smoothly as the architectural backbone of the portfolio.

---

## Phase 4: User Story 2 - Immersive "My-CV" Hero & Visual Atmosphere (Priority: P2)

**Goal**: Deliver the "Home" tab view: Hero section with starry particles, "Hi There! 👋" heading, animated typewriter, tiltable avatar card, and "Let Me Introduce Myself" section.

**Independent Test**: View the "Home" tab and verify starry background, typewriter loop, avatar 3D tilt tracking, and social links in `#2563eb`.

- [x] T010 [P] [US2] Verify hero rendering, name, headline, typewriter, and socials in `frontend/features/portfolio/components/PortfolioHero.tsx`
- [x] T011 [US2] Implement `frontend/features/portfolio/components/PortfolioHero.tsx` with:
  - Starry background canvas integration
  - "Hi There! 👋" heading with member's name
  - Dynamic typewriter rotation for roles/headline
  - Vector graphic & 3D tilt avatar card
  - "Let Me Introduce Myself" introductory section with quote and social icon buttons
  - Quick action CTA buttons to switch to "Projects" or "Resume" tabs

**Checkpoint**: Home tab delivers full `my-cv` visual experience.

---

## Phase 5: User Story 3 - Dynamic "Know Who I Am" & Visual Techstack/Toolstack (Priority: P3)

**Goal**: Deliver the "About" tab view: biography card, philosophical quote, and visual icon grids for "Professional Skillset" and "Tools I Use".

**Independent Test**: Switch to the "About" tab and confirm bio text, quote, and database skills partitioned into Techstack and Toolstack card grids.

- [x] T012 [P] [US3] Verify skill partitioning and bio rendering in `PortfolioAbout.tsx`
- [x] T013 [US3] Implement `frontend/features/portfolio/components/PortfolioAbout.tsx` with:
  - "Know Who I'M" biography card with quote footer
  - Partitioning logic separating languages/frameworks into "Professional Skillset" and developer tools into "Tools I Use"
  - Interactive grid cards with `TechIcons` and glowing border hover effects

---

## Phase 6: User Story 4 - Interactive GitHub Activity Calendar ("Days I Code") (Priority: P4)

**Goal**: Display the member's live GitHub contribution heat map under the "About" tab themed with DUT-AI Blue tones.

**Independent Test**: Verify that the "Days I Code" section renders contribution blocks with blue color intensity mapping and hover tooltips.

- [x] T014 [P] [US4] Create `frontend/features/portfolio/components/GithubCalendar.tsx` fetching GitHub contribution data with graceful fallback and `#2563eb` color scale
- [x] T015 [US4] Integrate `GithubCalendar` into `PortfolioAbout.tsx` under the "Days I Code" section, extracting the username from `socialLinks.github`

---

## Phase 7: User Story 5 - Showcase Project Cards with Verified Club Attribution (Priority: P5)

**Goal**: Deliver the "Projects" tab view: project showcase cards with thumbnails, descriptions, technology badges, GitHub buttons, and Live Demo links.

**Independent Test**: Switch to the "Projects" tab and verify card grid, Next.js `<Image />` optimization, GitHub repo links, live demo links, and official "DUT AI Project" badge.

- [x] T016 [P] [US5] Verify project cards, external links, and club badge display
- [x] T017 [US5] Implement `frontend/features/portfolio/components/PortfolioProjects.tsx` with:
  - "My Recent Works" heading and project count summary
  - Responsive project card grid with Next.js `<Image />` thumbnails
  - Club verified badges and assigned member roles
  - Technology stack pill badges
  - External GitHub repository and Live Demo action buttons with target blank security

---

## Phase 8: User Story 6 - Integrated Resume & CV Preview / Download (Priority: P6)

**Goal**: Deliver the "Resume" tab view: prominent download actions and document preview container.

**Independent Test**: Switch to the "Resume" tab and verify top & bottom download buttons and responsive document preview.

- [x] T018 [US6] Update `frontend/features/portfolio/components/PortfolioResume.tsx` with dual "Download CV" action buttons (styled in `#2563eb`), file size badge, and responsive PDF preview container

---

## Phase 9: Assembly, Integration & Polish

**Purpose**: Assemble all components into `app/members/[username]/page.tsx`, configure metadata, and verify zero regressions.

- [x] T019 Assemble the tab system into `frontend/app/members/[username]/page.tsx` with starry cosmos container, layout wrapper, and SEO metadata
- [x] T020 Update `frontend/app/members/[username]/loading.tsx` to match the cosmos dark skeleton theme
- [x] T021 Run full automated quality gate (`npm run test:unit`, `npx tsc --noEmit`, and ESLint) to ensure zero regressions across the codebase
