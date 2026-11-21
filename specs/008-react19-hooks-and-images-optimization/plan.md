# Implementation Plan: React 19 Hooks & Next.js Image Optimization

**Branch**: `008-react19-hooks-and-images-optimization` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

## Summary

Resolve React 19 cascading re-render warnings, fix conditional React hook violations, and replace all raw `<img>` HTML elements with optimized Next.js `<Image />` components across public and admin interfaces.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 15+  
**Primary Dependencies**: `next/image`, React 19 compiler & hooks  
**Target Areas**:
- React Hook Anti-patterns in 8 files: `MemberSearchSelect.tsx`, `MobileNav.tsx`, `ThemeSwitch.tsx`, `BlogListLayout.tsx`, `MarkdownEditor.tsx`, `PostLayoutAPI.tsx`, `RelatedPosts.tsx`, `EventsListLayout.tsx`.
- Raw `<img>` tags in 8 admin & utility files: `BlogAuthorsSection.tsx`, `BlogCoverImageSection.tsx`, `PublicEventForm.tsx`, `app/admin/events/page.tsx`, `PostForm.tsx`, `app/admin/posts/page.tsx`, `ProjectForm.tsx`, `app/admin/projects/page.tsx`.

## Constitution Check

- **Principle III: Clean Code & Modern Standards**: PASSED. Strictly conforms to React 19 hooks idioms and eliminates Core Web Vitals degradation caused by unoptimized `<img>` tags.
- **Principle IV: Verification, Testing & Quality Gates**: PASSED. Evaluated directly with ESLint rules `react-hooks/set-state-in-effect`, `react-hooks/rules-of-hooks`, and `@next/next/no-img-element`.

## Planned Execution Steps

### Phase 1: React 19 Hooks Modernization
1. Create a reusable client hydration hook `frontend/lib/hooks/useIsMounted.ts` utilizing `useSyncExternalStore`.
2. Refactor `ThemeSwitch.tsx`, `MobileNav.tsx`, `MarkdownEditor.tsx`, and `EventsListLayout.tsx` to use `useIsMounted()`.
3. Fix `MemberSearchSelect.tsx`: Eliminate synchronous `setActiveIndex(0)` and `setSearchQuery('')` inside `useEffect`, moving them to `onChange` and click handlers.
4. Fix `RelatedPosts.tsx`: Move `useEffect` above early return conditions to enforce identical hook call order.
5. Fix `BlogListLayout.tsx` and `PostLayoutAPI.tsx`: Use `startTransition` or microtask callbacks for state resets and view increments.

### Phase 2: Next.js Image Component Migration
1. Migrate admin blog forms (`BlogAuthorsSection.tsx`, `BlogCoverImageSection.tsx`) to `next/image` with explicit width/height and object-fit.
2. Migrate admin event forms & lists (`PublicEventForm.tsx`, `app/admin/events/page.tsx`) to `next/image`.
3. Migrate admin post forms & lists (`PostForm.tsx`, `app/admin/posts/page.tsx`) to `next/image`.
4. Migrate admin project forms & lists (`ProjectForm.tsx`, `app/admin/projects/page.tsx`) to `next/image`.

### Phase 3: Validation & Build Verification
1. Run `npx eslint .` to verify 0 errors in React hooks and 0 warnings in image elements.
2. Run `npx tsc --noEmit` to verify type safety.
3. Run `npm run build` to confirm production build cleanliness.
