# Test Matrix & Route Coverage Contract

**Feature**: `010-full-test-pyramid-suite`  
**Date**: 2026-11-21

## 1. Domain Coverage Matrix

| Domain / Module | Target Files | Unit Test | Integration Test | E2E Test |
|---|---|:---:|:---:|:---:|
| **Auth & RBAC** | `features/auth/types.ts`, `lib/auth-sso.ts`, `lib/auth-sso-server.ts` |  `rbac-partitioning.test.ts` |  `auth-me-route.test.ts`, `auth-logout-route.test.ts` |  `rbac-guard.spec.ts` |
| **Blog System** | `features/blog/db/queries.ts`, `app/api/blogs/route.ts` |  `blog-validators.test.ts`, `thumbnail-generator.test.ts` |  `blogs-route.test.ts` |  `public-navigation.spec.ts` |
| **Events System** | `features/events/db/queries.ts`, `lib/events.ts` |  `events-timeline.test.ts` |  `public-events-route.test.ts` |  `public-navigation.spec.ts` |
| **Projects** | `features/projects/db/queries.ts`, `app/api/projects/route.ts` |  `slug-generator.test.ts` |  `projects-route.test.ts` |  `public-navigation.spec.ts` |
| **Member Portfolio** | `features/users/db/queries.ts`, `features/users/utils/` |  `username-generator.test.ts`, `vietnamese-names.test.ts` |  `members-route.test.ts` |  `rbac-guard.spec.ts` |
| **Admin Shell** | `app/admin/**` | N/A (Server Components) |  `admin-actions.test.ts` |  `admin-smoke.spec.ts` |

## 2. RBAC Route Protection Contract

| Route | Unauthenticated | Member Role | Content Role | Admin Role |
|---|---|---|---|---|
| `/` (Home) |  200 OK |  200 OK |  200 OK |  200 OK |
| `/blog` |  200 OK |  200 OK |  200 OK |  200 OK |
| `/admin` |  Redirect `/admin/login` |  Redirect `/admin/portfolio` |  200 OK (Dashboard) |  200 OK (Dashboard) |
| `/admin/blogs` |  Redirect `/admin/login` |  Redirect `/admin/portfolio` (or 403) |  200 OK |  200 OK |
| `/admin/portfolio` |  Redirect `/admin/login` |  200 OK |  200 OK |  200 OK |
| `/admin/users` |  Redirect `/admin/login` |  Redirect `/admin/portfolio` (or 403) |  Forbidden / 403 |  200 OK |
