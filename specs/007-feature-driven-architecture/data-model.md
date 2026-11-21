# Data Model & Directory Mapping: Feature-Driven Architecture

**Feature**: `007-feature-driven-architecture`  
**Date**: 2026-11-21  

## 1. Directory Tree Schema

```plaintext
frontend/
├── app/                          # Pure routing, metadata & layout shells
│   ├── (auth)/                   # (Optional grouping if needed)
│   ├── admin/                    # Admin portal routes
│   │   ├── blogs/
│   │   ├── events/
│   │   ├── generations/
│   │   ├── introductions/
│   │   ├── keywords/
│   │   ├── login/
│   │   ├── portfolio/
│   │   ├── posts/
│   │   ├── projects/
│   │   └── users/
│   ├── api/                      # Next.js Route Handlers
│   ├── blog/                     # Public blog routes
│   ├── events/                   # Public events routes
│   ├── members/                  # Public portfolio routes
│   ├── projects/                 # Public projects routes
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── features/                     # Bounded Business Domains
│   ├── auth/
│   │   ├── components/           # LoginForm.tsx, UserMenuDropdown.tsx
│   │   ├── context/              # SsoAuthContext.tsx
│   │   └── lib/                  # admin-auth.ts, auth-sso.ts, auth-sso-server.ts
│   │
│   ├── blog/
│   │   ├── components/           # MarkdownEditor.tsx, NotionZipImportDialog.tsx,
│   │   │                         # Comments.tsx, Pre.tsx, TableOfContents.tsx,
│   │   │                         # RelatedPosts.tsx, Tag.tsx, BlogListLayout.tsx, PostLayoutAPI.tsx
│   │   └── lib/                  # blog-thumbnail-*.ts, notion/
│   │
│   ├── portfolio/
│   │   ├── components/           # PortfolioHero.tsx, PortfolioAbout.tsx,
│   │   │                         # PortfolioProjects.tsx, PortfolioSkills.tsx,
│   │   │                         # PortfolioResume.tsx, admin/portfolio/*
│   │   └── lib/                  # reserved-usernames.ts, username-generator.ts
│   │
│   ├── projects/
│   │   └── components/           # ProjectsListClient.tsx, project components
│   │
│   ├── events/
│   │   ├── components/           # EventIcons.tsx, MemorableEvents.tsx,
│   │   │                         # PastEventsList.tsx, PhotoStack.tsx,
│   │   │                         # UpcomingWorkshop.tsx, EventsListLayout.tsx
│   │   └── types.ts
│   │
│   └── generations/
│       └── components/           # GenerationAlbum.tsx, MemberDetailModal.tsx
│
├── components/                   # Cross-cutting primitives & page sections
│   ├── ui/                       # Shadcn UI atoms (button, card, dialog, badge...)
│   ├── layout/                   # Header, Footer, MobileNav, ThemeSwitch,
│   │                             # SectionContainer, LayoutWrapper, PageTitle
│   ├── common/                   # DutaiWaffle, CopyButton, SparkleIcon,
│   │                             # SocialShare, ScrollTopAndComment, SearchButton
│   ├── home/                     # Landing page sections (Hero, Moments, Roadmap...)
│   └── about/                    # About page sections (AboutHero, Story, Values...)
│
├── lib/                          # Shared Infrastructure & Core Clients
│   ├── api-client.ts             # Moved from app/api-client.ts
│   ├── api.ts                    # Backend fetchers
│   ├── db/                       # Drizzle ORM client, schemas, queries
│   ├── minio.ts                  # Object storage client
│   ├── types.ts                  # Cross-cutting shared TypeScript types
│   ├── utils.ts                  # cn(), formatters
│   └── enums/                    # roles.ts
```

## 2. File Relocation Matrix

| Original Location | New Target Location | Category |
|-------------------|---------------------|----------|
| `app/api-client.ts` | `lib/api-client.ts` | Shared Utility |
| `components/Header.tsx` | `components/layout/Header.tsx` | Layout Shell |
| `components/Footer.tsx` | `components/layout/Footer.tsx` | Layout Shell |
| `components/MobileNav.tsx` | `components/layout/MobileNav.tsx` | Layout Shell |
| `components/ThemeSwitch.tsx` | `components/layout/ThemeSwitch.tsx` | Layout Shell |
| `components/SectionContainer.tsx` | `components/layout/SectionContainer.tsx` | Layout Shell |
| `components/LayoutWrapper.tsx` | `components/layout/LayoutWrapper.tsx` | Layout Shell |
| `components/PageTitle.tsx` | `components/layout/PageTitle.tsx` | Layout Shell |
| `components/Link.tsx` | `components/common/Link.tsx` | Common UI |
| `components/Image.tsx` | `components/common/Image.tsx` | Common UI |
| `components/Card.tsx` | `components/common/Card.tsx` (or unify `ui/card`) | Common UI |
| `components/CopyButton.tsx` | `components/common/CopyButton.tsx` | Common UI |
| `components/SparkleIcon.tsx` | `components/common/SparkleIcon.tsx` | Common UI |
| `components/SocialShare.tsx` | `components/common/SocialShare.tsx` | Common UI |
| `components/ScrollTopAndComment.tsx` | `components/common/ScrollTopAndComment.tsx` | Common UI |
| `components/SearchButton.tsx` | `components/common/SearchButton.tsx` | Common UI |
| `components/auth/UserMenuDropdown.tsx` | `features/auth/components/UserMenuDropdown.tsx` | Auth Feature |
| `context/SsoAuthContext.tsx` | `features/auth/context/SsoAuthContext.tsx` | Auth Feature |
| `layouts/BlogListLayout.tsx` | `features/blog/components/BlogListLayout.tsx` | Blog Feature |
| `layouts/PostLayoutAPI.tsx` | `features/blog/components/PostLayoutAPI.tsx` | Blog Feature |
| `components/MDXComponents.tsx` | `features/blog/components/MDXComponents.tsx` | Blog Feature |
| `components/Comments.tsx` | `features/blog/components/Comments.tsx` | Blog Feature |
| `components/Pre.tsx` | `features/blog/components/Pre.tsx` | Blog Feature |
| `components/TableOfContents.tsx` | `features/blog/components/TableOfContents.tsx` | Blog Feature |
| `components/RelatedPosts.tsx` | `features/blog/components/RelatedPosts.tsx` | Blog Feature |
| `components/Tag.tsx` | `features/blog/components/Tag.tsx` | Blog Feature |
| `components/admin/MarkdownEditor.tsx` | `features/blog/components/MarkdownEditor.tsx` | Blog Feature |
| `components/admin/NotionZipImportDialog.tsx` | `features/blog/components/NotionZipImportDialog.tsx` | Blog Feature |
| `layouts/EventsListLayout.tsx` | `features/events/components/EventsListLayout.tsx` | Events Feature |
| `components/events/*` | `features/events/components/*` | Events Feature |
| `components/portfolio/*` | `features/portfolio/components/*` | Portfolio Feature |
| `components/admin/portfolio/*` | `features/portfolio/components/admin/*` | Portfolio Feature |
| `components/about/GenerationAlbum.tsx` | `features/generations/components/GenerationAlbum.tsx` | Generations Feature |
| `components/about/MemberDetailModal.tsx` | `features/generations/components/MemberDetailModal.tsx` | Generations Feature |
| `app/projects/ProjectsListClient.tsx` | `features/projects/components/ProjectsListClient.tsx` | Projects Feature |
| `app/projects/components/*` | `features/projects/components/*` | Projects Feature |
