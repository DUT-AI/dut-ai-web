# Research: Feature-Driven / Modular Architecture Refactoring

**Feature**: `007-feature-driven-architecture`  
**Date**: 2026-11-21  

## Decision 1: Boundary Definition for `features/` vs `components/`

- **Decision**: 
  - `features/`: Bounded business domains with independent CRUD, state, and domain UI:
    * `features/blog`: Blog lists, detail views, Notion import dialogs, MDX editor, table of contents, comments, related posts.
    * `features/projects`: Project showcase grids, detail dialogs, admin project CRUD components and actions.
    * `features/events`: Events lists, event timeline, photo stacks, past events, upcoming workshops.
    * `features/portfolio`: Portfolio edit forms, preview components (Hero, About, Projects, Skills, Resume), username generators, reserved usernames.
    * `features/generations`: Member detail modals, generation album components, generation CRUD actions.
    * `features/auth`: User menu dropdown, login forms, SSO auth context, admin auth helpers.
  - `components/`: Pure cross-cutting primitives and presentation layouts:
    * `components/ui/`: Atomic design system components (buttons, badges, inputs, dialogs, cards - Shadcn UI).
    * `components/layout/`: Global framing components (Header, Footer, MobileNav, ThemeSwitch, SectionContainer, LayoutWrapper).
    * `components/common/`: Shared application widgets (e.g. DutaiWaffle, SparkleIcon, CopyButton, SocialShare).
    * `components/home/`: Landing page marketing sections (Hero, Moments, Roadmap, StatCounter).
    * `components/about/`: About page story & values sections (AboutHero, AboutStory, AboutCoreValues, AboutActivities).
- **Rationale**: 
  - Prevents domain logic leakage into reusable UI primitives.
  - Allows deleting or refactoring an entire domain (e.g., `features/events`) in a single self-contained directory without scanning hundreds of unrelated files.
- **Alternatives Considered**: 
  - *Keep everything in `components/` with subfolders*: Rejected because `components/` becomes a massive junk-drawer mixing UI buttons with complex database mutations and Server Actions.
  - *Colocate all components inside `app/(routes)/_components`*: Rejected because several components are shared across both Public and Admin routes (e.g., Portfolio components used in both `/admin/portfolio` and `/members/[username]`).

---

## Decision 2: Elimination of Legacy `layouts/`

- **Decision**: 
  - Migrate `frontend/layouts/BlogListLayout.tsx` and `frontend/layouts/PostLayoutAPI.tsx` into `features/blog/layouts/` or `features/blog/components/`.
  - Migrate `frontend/layouts/EventsListLayout.tsx` into `features/events/layouts/` or `features/events/components/`.
  - Delete `frontend/layouts/` entirely once all references are updated.
- **Rationale**: 
  - Next.js 15 App Router natively handles layouts via `layout.tsx`. Standalone template layouts are feature-specific views, not global framework layouts.
- **Alternatives Considered**: 
  - *Retaining `layouts/`*: Rejected as it violates Next.js App Router idioms and confuses developers between Next.js `layout.tsx` and custom layout wrappers.

---

## Decision 3: Relocation of `app/api-client.ts`

- **Decision**: Move `frontend/app/api-client.ts` to `frontend/lib/api-client.ts` (or `frontend/lib/api/api-client.ts`).
- **Rationale**: The `app/` directory in App Router should be strictly reserved for routing files (`page.tsx`, `layout.tsx`, `route.ts`, route groups, and route-local components). Utility libraries belong in `lib/`.
- **Alternatives Considered**: 
  - *Leaving it in `app/`*: Rejected; violates clean Next.js architecture and convention.

---

## Decision 4: TypeScript Path Aliases

- **Decision**: Add `@/features/*` to `frontend/tsconfig.json` paths:
  ```json
  "paths": {
    "@/*": ["./*"],
    "@/features/*": ["./features/*"],
    "@/components/*": ["./components/*"],
    "@/lib/*": ["./lib/*"],
    "@/data/*": ["./data/*"]
  }
  ```
- **Rationale**: Enables clean, standard imports across the codebase (`import { BlogCard } from '@/features/blog/components'`) without awkward relative paths like `../../../features/blog`.

---

## Decision 5: Non-Breaking Incremental Migration Strategy

- **Decision**: Migrate in structured phases:
  1. Add path aliases in `tsconfig.json`.
  2. Create `components/layout/` and move global framing components (`Header`, `Footer`, `MobileNav`, etc.).
  3. Relocate `app/api-client.ts` to `lib/api-client.ts`.
  4. Move domain components to their respective `features/<domain>/` folders.
  5. Absorb `layouts/` into `features/blog/` and `features/events/`.
  6. Batch-update import statements across `app/`, `features/`, and `components/`.
  7. Run `npx tsc --noEmit` and `npm run build` after each phase to guarantee 0 regressions.
- **Rationale**: Keeps git history understandable and eliminates risk of runtime bundler failure.
