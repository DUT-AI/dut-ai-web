# Technical Research & Architecture Decisions: Enhanced OpenGraph Thumbnails

**Feature**: `003-enhanced-og-thumbnails`  
**Date**: 2026-10-15  
**Status**: Completed  

---

## 1. Official Club Logo Loading Strategy

### Decision
Read `frontend/public/static/images/logo.png` directly from disk using Node.js `fs.readFileSync` at module level (or lazy-cached singleton) and convert it into a base64 Data URL (`data:image/png;base64,...`).

### Rationale
- **Zero Network Overhead**: Calling external HTTP URLs (e.g. `https://clb.dutai.io.vn/...`) inside Satori introduces network latency, DNS resolution, and fails in local development or preview environments without internet.
- **Sub-millisecond Rendering**: Base64 strings are parsed instantly by Satori's HTML engine.
- **Portability**: Works uniformly across local dev server (`npm run dev`), build time, and production Docker containers.

### Alternatives Considered
- *External URL fetch*: Rejected because it adds 50-200ms latency to image generation and breaks in isolated/staging environments.
- *SVG re-vectorization*: Rejected because `logo.png` is the canonical club logo asset provided by the user.

---

## 2. Multi-Author Representation & Vietnamese Initial Fallback

### Decision
1. Update `BlogThumbnailOptions` to accept structured author objects:
   ```typescript
   export type BlogAuthorInfo = {
     name: string
     avatarUrl?: string | null
   }
   ```
   Accept both `BlogAuthorInfo[]` and legacy `string[]` for 100% backward compatibility.
2. In the thumbnail layout, render an avatar cluster:
   - For up to 3 authors, show individual circular avatars (44x44px) alongside their full names.
   - For >3 authors, render the first 3 avatars and an overflow badge (`+N`).
3. For authors lacking an `avatarUrl` or when remote image fails:
   - Extract the Vietnamese first name (tên gọi) by taking the last whitespace-separated word token of the full name.
   - Extract its first character, capitalized:
     ```typescript
     export function getVietnameseInitial(fullName: string): string {
       const parts = fullName.trim().split(/\s+/).filter(Boolean)
       if (parts.length === 0) return 'D'
       const firstName = parts[parts.length - 1]
       const char = Array.from(firstName)[0] || 'D'
       return char.toUpperCase()
     }
     ```
   - Generate a deterministic pleasant background color using a string hash algorithm mapped to a curated palette (`#2563EB`, `#0D9488`, `#D97706`, `#DC2626`, `#4F46E5`, `#059669`, `#EA580C`).

### Rationale
- Complies strictly with Vietnamese cultural naming conventions: "Huỳnh Phước Nguyên" -> "Nguyên" -> "N"; "Phan Thanh Sơn" -> "Sơn" -> "S".
- Deterministic colors ensure the same author always receives the same visual badge across different blog posts.

### Alternatives Considered
- *First word initial (Họ)*: Rejected because "Nguyễn", "Trần", "Lê" represent over 60% of Vietnamese family names, causing almost all fallbacks to be 'N' or 'T'.
- *Two-letter initial (First + Last)*: Rejected because single-letter initials in 44x44px circular badges have vastly superior legibility in social media feeds.

---

## 3. Investigation & Resolution of Social Media Blurriness

### Root Cause Analysis

| Factor | Current State | Root Cause of Blurriness | Resolution |
|---|---|---|---|
| **Typography** | `fontFamily: 'Arial, sans-serif'` | Linux/Docker servers lack Arial; Satori falls back to generic fallback with poor Vietnamese diacritic anti-aliasing | Load native `public/fonts/BeVietnamPro-Variable.ttf` directly into `ImageResponse.fonts` |
| **Caching** | `max-age=0, s-maxage=300` | Social scrapers (Facebook, Zalo, Twitter) receive ephemeral headers, fail to warm CDN caches, and fall back to downscaled cached preview proxies | Configure `Cache-Control: public, max-age=31536000, immutable` for slug-based images |
| **Meta Dimensions** | Conditional `width`/`height` | If `post.image_url` is provided, `width` and `height` were omitted, causing Facebook/Zalo to downgrade card to a small square preview that gets stretched and blurred | Always output explicit `width: 1200`, `height: 630`, `type: 'image/png'` and `twitter:card: 'summary_large_image'` |
| **Canvas & Layout** | 1200x630 with thin 1-2px borders | Thin borders and small 14px text suffer heavy degradation under social media 4:2:0 JPEG chroma downsampling | Boost font contrast, increase minimum font sizes (min 16px for metadata, min 52px for titles), and use crisp vector-styled cards |

### Decision
1. **Embed Native TTF Font**: Load `frontend/public/fonts/BeVietnamPro-Variable.ttf` (already present in repository) as an ArrayBuffer and pass it into `ImageResponse({ fonts: [{ name: 'Be Vietnam Pro', data: fontData, weight: 700, style: 'normal' }] })`.
2. **Optimize Cache Headers**: Set `Cache-Control: public, max-age=31536000, immutable` for `/api/og/blog/[slug]` so social scrapers and CDNs cache the crisp lossless PNG indefinitely.
3. **Harmonize Metadata**: Ensure `app/blog/[...slug]/page.tsx` always sets `og:image:width: 1200`, `og:image:height: 630`, `og:image:type: 'image/png'`, and `twitter:card: 'summary_large_image'`.
4. **Editor Live Preview Sync**: Update `app/admin/blogs/BlogForm.tsx` to pass author details (`name` and `avatar_url`) to `/api/og/blog/preview` so admin users see the exact high-fidelity result in real-time.

---

## 4. Summary of Tech Choices

- **Image Engine**: Next.js native `ImageResponse` (`next/og` powered by Satori + Resvg WASM).
- **Font**: `BeVietnamPro-Variable.ttf` (Local filesystem, 185KB, TTF format).
- **Logo Asset**: `public/static/images/logo.png` (Base64 data URI).
- **Canvas Resolution**: 1200 x 630 (Standard OpenGraph 1.91:1 ratio, optimized for crisp subpixel text).
- **Output Format**: Lossless PNG with durable caching.
