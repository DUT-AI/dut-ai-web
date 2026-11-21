# Feature Specification: React 19 Hooks & Next.js Image Optimization

**Feature Branch**: `008-react19-hooks-and-images-optimization`  
**Created**: 2026-11-21  
**Status**: Draft  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Eliminate React 19 Cascading Renders & Conditional Hooks (Priority: P1)
As a web visitor and admin user, I want state updates and effects to run without triggering cascading renders or violating React Hook rules, so that the UI does not stutter or flash during navigation, dropdown searching, and theme toggling.

**Independent Test**: Run `npx eslint .` and verify that all `react-hooks/set-state-in-effect` errors and the conditional `useEffect` in `RelatedPosts.tsx` are 100% resolved.

**Acceptance Scenarios**:
1. **Given** a user searching for members in `MemberSearchSelect.tsx`, **When** the query changes or dropdown closes, **Then** state resets occur during user action callbacks or via derived state rather than synchronous `useEffect` calls.
2. **Given** theme switching and mobile navigation, **When** components mount on client, **Then** hydration is handled cleanly using `useSyncExternalStore` or an idiomatic hydration helper rather than raw `useEffect(setMounted(true))`.
3. **Given** `RelatedPosts.tsx`, **When** early returns occur, **Then** React Hooks are never invoked conditionally.

---

### User Story 2 - Convert Raw `<img>` Tags to Next.js `<Image />` (Priority: P2)
As a web user and system administrator, I want all images (avatars, event posters, blog covers, project thumbnails) to be delivered using Next.js optimized `<Image />` components with proper dimension constraints, so that images load with modern compression (WebP/AVIF), without Cumulative Layout Shift (CLS), and without consuming excessive bandwidth.

**Independent Test**: Run `npx eslint .` and verify that zero `@next/next/no-img-element` warnings remain in admin forms, listings, and components.

**Acceptance Scenarios**:
1. **Given** admin blog forms, cover image previews, and author avatars, **When** previewing or uploading images, **Then** `<Image />` is rendered with defined aspect ratio and object-fit styling.
2. **Given** admin event lists and project forms, **When** images are displayed, **Then** responsive optimized images are rendered without layout jank.

## Success Criteria *(mandatory)*
- **SC-001**: 0 ESLint errors for `react-hooks/set-state-in-effect` and `react-hooks/rules-of-hooks`.
- **SC-002**: 0 ESLint warnings for `@next/next/no-img-element` across `frontend/`.
- **SC-003**: 0 TypeScript compilation errors (`npx tsc --noEmit`).
- **SC-004**: Production build (`npm run build`) passes cleanly with exit code 0.
