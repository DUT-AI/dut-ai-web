# Phase 0 Research: My-CV Portfolio Redesign Architecture & Technology Selection

## 1. Problem Statement & Design Objectives
The original `my-cv` repository (`my-cv/`) was constructed using React 17, Bootstrap 5 (`react-bootstrap`), raw CSS stylesheets, and older visual animation packages (`react-tsparticles`, `typewriter-effect`, `react-github-calendar`, `react-pdf`). Directly copying this codebase into DUT-AI Web (`frontend/`) creates several critical issues:
1. **CSS Collision**: Bootstrap 5 resets global HTML elements and disrupts Tailwind CSS v4 styling across the entire website.
2. **React 19 & Next.js 16 Compatibility**: React 17 libraries crash with React 19 concurrent features and SSR hydration.
3. **Hardcoded vs. Dynamic**: `my-cv` hardcodes personal information in JSX components, whereas DUT-AI Web requires dynamic data binding from the PostgreSQL database (`users`, `user_cv`, `user_portfolio_projects`, `project_members`).
4. **Brand Consistency**: The original purple accent (`#c770f0`) must be shifted to the DUT-AI brand blue (`#2563eb`).

## 2. Component Adaptation & Modern Tech Stack

| Feature in `my-cv` | Original Tool | Modern Solution for DUT-AI Web (React 19 / Next.js) | Rationale |
| :--- | :--- | :--- | :--- |
| **Starry Particle Background** | `react-tsparticles` | HTML5 Canvas `<canvas>` custom lightweight hook or lightweight particle engine | 0 dependency bloat (<3KB), 60 FPS performance, no React 19 hydration mismatch, respects `prefers-reduced-motion`. |
| **Typewriter Animation** | `typewriter-effect` | Custom pure React hook `useTypewriter` | Zero dependencies, server-safe, smoothly loops through member's dynamic headline and roles with blinking cursor. |
| **Techstack / Toolstack Icons** | `react-icons` (huge bundle) | `lucide-react` + SVG Icon Resolver with fallbacks | High performance, tree-shakeable, matches database skill labels with glowing rounded card styles. |
| **GitHub Activity Calendar** | `react-github-calendar` | Modern GitHub Contribution component with native fetch / SVG rendering & tooltip | Renders user's real GitHub activity, styled with DUT-AI Blue color scale (`#eff6ff` -> `#1d4ed8`), graceful fallback if offline. |
| **Interactive Tilt Effect** | `react-parallax-tilt` | Native CSS 3D transform on mouse move or `motion` | Lightweight, buttery-smooth mouse tracking without external React 17 package. |
| **Project Showcase Cards** | `react-bootstrap/Card` | Tailwind card with Next.js `<Image />` & hover glow | Meets Constitution Principle III (<Image> mandate), provides GitHub + Live Demo buttons and club badges. |
| **Resume & PDF Preview** | `react-pdf` (DOM worker issues) | PDF Object / Iframe Previewer with direct Download CTA button | Avoids canvas worker mismatch, instant preview across all modern browsers and mobile. |

## 3. Brand Theme & Styling Strategy
- **Background**: Dark space cosmos gradient:
  - Dark Mode: `bg-[#0c0513]` / `from-[#110d1a] via-[#0c0513] to-[#07030a]`
  - Soft contrast containers: `bg-slate-900/60 backdrop-blur-md border border-slate-800/80`
- **Accent Color**:
  - Primary: `#2563eb` (DUT-AI Blue)
  - Glow/Highlights: `#3b82f6` and `#60a5fa`
  - Badges/Tags: `bg-blue-500/15 text-blue-400 border-blue-500/30`
- **Typography & Details**:
  - Wave emoji animation: `inline-block origin-[70%_70%] animate-wave`
  - High-impact headings with `<span className="text-blue-500">` highlights.

## 4. Architectural Boundaries (Vertical Slice Architecture)
Following Constitution Principle I:
- All redesigned portfolio UI components live in `frontend/features/portfolio/components/`:
  - `PortfolioHero.tsx` (Starry canvas background, Typewriter, Tilt avatar, social links)
  - `PortfolioAbout.tsx` (Bio card, philosophical quote, Techstack grid, Toolstack grid, GitHub Calendar)
  - `PortfolioProjects.tsx` (Showcase project cards with GitHub repo, live demo, and club badges)
  - `PortfolioResume.tsx` (Resume download button, PDF preview card)
  - `PortfolioParticles.tsx` (Lightweight HTML5 starry particle canvas component)
  - `GithubCalendar.tsx` (GitHub contribution graph adapted with blue theme)
- Data fetching remains cleanly separated in `frontend/features/users/db/queries.ts`.
