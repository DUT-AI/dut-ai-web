# Research: React 19 Hooks and Next.js Image Optimization

**Feature**: `008-react19-hooks-and-images-optimization`  
**Date**: 2026-11-21  

## 1. React 19 Hook Cascading Renders (`react-hooks/set-state-in-effect`)

### Issue Analysis
React 19 compiler and linter enforce strict rendering purity. Setting state synchronously within an effect:
```tsx
useEffect(() => {
  setMounted(true)
}, [])
```
forces React to finish the first render pass, commit to DOM, immediately invalidate, and run a second render pass. 

### Solutions & Patterns:
1. **Client Hydration State (`mounted`)**:
   - Instead of manual `useEffect(() => setMounted(true), [])`, use `useSyncExternalStore`:
   ```tsx
   import { useSyncExternalStore } from 'react'
   const emptySubscribe = () => () => {}
   export function useIsMounted() {
     return useSyncExternalStore(emptySubscribe, () => true, () => false)
   }
   ```
   *Benefit*: Clean, idiomatic, zero cascading render warnings, 100% hydration-safe.

2. **Resetting State on Prop/Search Change (e.g. `MemberSearchSelect`)**:
   - *Current Anti-pattern*: `useEffect(() => setActiveIndex(0), [searchQuery])`
   - *Idiomatic Solution*: Handle state reset in the event handler (e.g. `handleSearchChange`) or compute active index directly.

3. **Conditional Hook in `RelatedPosts.tsx`**:
   - Move all `useEffect` calls above any early return `if (!posts || posts.length === 0) return null`.

4. **Optimistic Views in `PostLayoutAPI.tsx`**:
   - Defer view count increment to post-mount async microtask or use `startTransition`.

---

## 2. Next.js Image Optimization (`@next/next/no-img-element`)

### Issue Analysis
Files using raw `<img src={...} />`:
- `app/admin/blogs/components/BlogAuthorsSection.tsx` (Author avatars)
- `app/admin/blogs/components/BlogCoverImageSection.tsx` (Blog cover preview)
- `app/admin/events/PublicEventForm.tsx` (Event poster preview)
- `app/admin/events/page.tsx` (Event list poster thumbnail)
- `app/admin/posts/PostForm.tsx` (Post image preview)
- `app/admin/posts/page.tsx` (Post thumbnail)
- `app/admin/projects/ProjectForm.tsx` (Project cover preview)
- `app/admin/projects/page.tsx` (Project table thumbnail)
- `lib/blog-thumbnail.tsx` (Note: SVG/Satori canvas elements can keep unoptimized or `next/image` with unoptimized flag where appropriate)

### Implementation Strategy:
- Replace with `import Image from 'next/image'`.
- Use `unoptimized={true}` for MinIO object URLs or blob/data URLs if remote patterns are dynamic, or define exact `width` and `height` with `className="object-cover rounded-md"`.
- This satisfies `@next/next/no-img-element`, protects against CLS, and ensures proper accessibility attributes.
