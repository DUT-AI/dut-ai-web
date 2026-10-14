# Data Model: Enhanced OpenGraph Thumbnails

**Feature**: `003-enhanced-og-thumbnails`  
**Date**: 2026-10-15  
**Status**: Completed  

---

## Entities & Interfaces

### 1. `BlogAuthorInfo`

Represents an individual author attributed to a blog post, containing identity and presentation attributes for thumbnail rendering.

| Field | Type | Required | Description | Validation / Constraints |
|---|---|---|---|---|
| `name` | `string` | Yes | Full display name of author | Non-empty string; trimmed |
| `avatarUrl` | `string \| null` | No | Direct URL to author's avatar image | Must be valid HTTP/HTTPS URL or undefined |
| `initial` | `string` | Derived | Computed 1-character initial | Uppercase letter derived from Vietnamese first name (tên gọi) |
| `fallbackBgColor` | `string` | Derived | Deterministic avatar background | Hex color code chosen from curated accessible palette |

#### Name Parsing Rules (Vietnamese Convention)
- Name is split by whitespace: `const tokens = name.trim().split(/\s+/).filter(Boolean)`
- The final token is the first name (tên gọi): `const firstName = tokens[tokens.length - 1]`
- Initial is first letter of `firstName`: `Array.from(firstName)[0].toUpperCase()`
- Examples:
  - `"Huỳnh Phước Nguyên"` ➔ `firstName = "Nguyên"` ➔ `initial = "N"`
  - `"Phan Thanh Sơn"` ➔ `firstName = "Sơn"` ➔ `initial = "S"`
  - `"Admin"` ➔ `firstName = "Admin"` ➔ `initial = "A"`
  - `""` (empty) ➔ Fallback `initial = "D"`

---

### 2. `BlogThumbnailOptions`

Input payload passed to `createBlogThumbnail()` in `lib/blog-thumbnail.tsx`.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | Yes | N/A | Blog post title (normalized, max 150 chars) |
| `authors` | `Array<BlogAuthorInfo \| string>` | No | `[]` | List of author objects or name strings |
| `siteDomain` | `string` | No | `clb.dutai.io.vn` | Domain shown in thumbnail footer |
| `category` | `string` | No | `'BLOG'` | Badge label in top-right corner |

---

### 3. `SocialImageMetadata`

OpenGraph & Twitter Card metadata generated for `<head>` in `app/blog/[...slug]/page.tsx`.

| Field | Type | Value | Purpose |
|---|---|---|---|
| `url` | `string` | Absolute HTTPS URL | Canonical image link for social scrapers |
| `secureUrl` | `string` | Absolute HTTPS URL | Ensures HTTPS-only crawlers load preview |
| `alt` | `string` | Blog Title | Screen reader and accessibility description |
| `type` | `string` | `'image/png'` | Explicit MIME type preventing scraper MIME sniffing |
| `width` | `number` | `1200` | Informs crawler of card aspect ratio (1.91:1) |
| `height` | `number` | `630` | Informs crawler of large card display dimensions |
