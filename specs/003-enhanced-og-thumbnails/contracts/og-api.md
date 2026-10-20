# API Contract: OpenGraph Blog Thumbnail Endpoints

**Feature**: `003-enhanced-og-thumbnails`  
**Date**: 2026-10-15  
**Status**: Completed  

---

## Endpoint 1: Slug-Based Thumbnail Generator

Generates the canonical OpenGraph banner for a published blog post by its unique slug or numeric ID.

- **Method**: `GET`
- **Route**: `/api/og/blog/[slug]`
- **Authentication**: None (Public endpoint consumed by social crawlers & browsers)

### Parameters
- **Path Parameter**: `slug` (string, required): Blog slug or numeric ID (e.g. `xay-dung-he-thong-ai` or `42`).

### Internal Data Flow
1. Query blog by slug via `getBlogBySlugCached(slug)` (or ID fallback).
2. If post not found, return HTTP 404 text response.
3. Extract author list: `post.authors.map(author => ({ name: author.name, avatarUrl: author.avatar_url }))`.
4. Call `createBlogThumbnail({ title: post.title, authors })`.

### Response
- **Status**: `200 OK`
- **Headers**:
  - `Content-Type`: `image/png`
  - `Cache-Control`: `public, max-age=31536000, immutable`
- **Body**: Binary PNG image data (1200x630 pixels).

---

## Endpoint 2: Real-time Editor Preview Endpoint

Generates live thumbnail previews directly from the Admin Blog Form while creating or editing a blog post, supporting dynamic author names and avatars.

- **Method**: `GET`
- **Route**: `/api/og/blog/preview`
- **Authentication**: None / Public read-only preview

### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | No | Post title (default: sample AI title) |
| `authors` | `string` (JSON) | No | URL-encoded JSON array of `{ name: string, avatarUrl?: string }` |
| `author` | `string[]` | No | Fallback repeated query param for names (legacy support) |

### Query Example
```
/api/og/blog/preview?title=H%E1%BB%87+th%E1%BB%91ng+AI&authors=%5B%7B%22name%22%3A%22Nguy%E1%BB%85n+V%C4%83n+An%22%7D%5D
```

### Response
- **Status**: `200 OK`
- **Headers**:
  - `Content-Type`: `image/png`
  - `Cache-Control`: `no-store, no-cache, must-revalidate` (Prevents editor preview caching)
- **Body**: Binary PNG image data (1200x630 pixels).
