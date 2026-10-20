# Implementation Plan: Enhanced OpenGraph Thumbnails & Multi-Author Avatars

**Branch**: `003-enhanced-og-thumbnails` | **Date**: 2026-10-15 | **Spec**: [specs/003-enhanced-og-thumbnails/spec.md](spec.md)

**Input**: Feature specification from `/specs/003-enhanced-og-thumbnails/spec.md`

## Summary

Enhance the dynamic blog OpenGraph thumbnail generator to:
1. Render the official DUT AI Club logo (`frontend/public/static/images/logo.png`) instead of a generic text box.
2. Display multi-author avatars with a robust fallback to the initial of the author's Vietnamese first name (tên gọi).
3. Eliminate social media preview blurriness on Facebook, Zalo, Twitter/X, and LinkedIn by embedding native TTF font (`BeVietnamPro-Variable.ttf`), configuring immutable crawler caching headers, and enforcing complete OpenGraph dimensions metadata (`width: 1200, height: 630, type: image/png, twitter:card: summary_large_image`).
4. Update the Admin BlogForm live preview to mirror published fidelity.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 15.x (App Router)  
**Primary Dependencies**: `next/og` (`ImageResponse` powered by Satori & Resvg WASM), React 19  
**Storage**: N/A (Dynamic compute with Edge/Node runtime caching and HTTP `Cache-Control`)  
**Testing**: Unit tests for Vietnamese initial parser (`vitest` / `bun test`), end-to-end endpoint verification (`curl` / manual browser inspection)  
**Target Platform**: Linux container (Docker) & macOS/Linux development environments  
**Project Type**: Next.js Web Application (Route Handlers & OpenGraph generation)  
**Performance Goals**: Image generation response time < 350ms; zero external network dependencies for fonts/logo  
**Constraints**: Canvas size 1200x630 (1.91:1 ratio); font support for complete Vietnamese diacritics  
**Scale/Scope**: All published blogs and live preview in `/admin/blogs/create` and `/admin/blogs/[id]/edit`  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Status | Notes |
|---|---|---|
| I. Library-First | PASS | Pure helper functions (`getVietnameseInitial`, `createBlogThumbnail`) in `lib/` decoupled from HTTP layer |
| II. Simplicity & YAGNI | PASS | Direct base64 filesystem loading for logo & font; no heavy external image manipulation services |
| III. Testable & Verifiable | PASS | Isolated name parsing logic with comprehensive unit tests for Vietnamese accents; deterministic color hashing |
| IV. Backward Compatibility | PASS | `BlogThumbnailOptions` accepts both `BlogAuthorInfo[]` and legacy `string[]` |

## Project Structure

### Documentation (this feature)

```text
specs/003-enhanced-og-thumbnails/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Technical research & decisions (Phase 0 output)
├── data-model.md        # Entities & schema definitions (Phase 1 output)
├── quickstart.md        # Validation scenarios & testing guide (Phase 1 output)
├── contracts/           # API contracts (Phase 1 output)
│   └── og-api.md
├── checklists/          # Quality checklists
│   └── requirements.md
└── tasks.md             # Implementation tasks (/speckit-tasks output)
```

### Source Code Impact Areas

```text
frontend/
├── app/
│   ├── admin/
│   │   └── blogs/
│   │       └── BlogForm.tsx             # Pass author avatars to live preview endpoint
│   ├── api/
│   │   └── og/
│   │       └── blog/
│   │           ├── [slug]/route.ts       # Pass authors with avatar URLs, set immutable cache
│   │           └── preview/route.ts      # Accept structured authors and render live preview
│   └── blog/
│       └── [...slug]/page.tsx           # Ensure og:image:width, height, type, twitter:card large image
├── lib/
│   ├── blog-thumbnail.tsx               # Core ImageResponse generator: logo, multi-avatar, font, layout
│   └── blog-thumbnail-url.ts           # URL helper methods
└── public/
    ├── fonts/
    │   └── BeVietnamPro-Variable.ttf    # Embedded font for crystal-clear Vietnamese rendering
    └── static/
        └── images/
            └── logo.png                 # Official club logo asset
```

**Structure Decision**: Web application feature modifying existing Next.js App Router route handlers, core UI generator library, and admin form live preview component.

## Complexity Tracking

No constitution violations detected. Solution uses built-in Next.js `next/og` with local asset loading and standard HTTP caching.
