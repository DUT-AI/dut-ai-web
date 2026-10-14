# Phase 0 Research: Notion ZIP Blog Post Import

**Feature**: `002-notion-zip-blog-import`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## Technical Context & Decisions

### 1. ZIP Parsing Strategy & Library Selection

- **Decision**: Use `jszip` executed within a Next.js Server Route Handler (`POST /api/admin/blogs/import-notion`).
- **Rationale**:
  - `jszip` is a pure JavaScript/TypeScript library with no native C++ bindings, making it portable across all deployment platforms (Docker, Vercel, Node.js standalone).
  - Processing on the server allows direct in-memory extraction of files without writing temporary files to disk, eliminating filesystem cleanup overhead.
  - Server-side execution maintains security by keeping MinIO credentials, S3 SDK instances, and database queries for slug uniqueness on the protected backend.
- **Alternatives Considered**:
  - *Client-side parsing in browser with JSZip + multiple uploads*: Requires the client browser to upload each image sequentially to `/api/upload`. For archives with 10-20 images, this results in network waterfalls, higher user-side latency, and potential partial failure states.
  - *`adm-zip` or `yauzl`*: `adm-zip` has known issues with certain UTF-8 path encodings on Node.js; `yauzl` uses a callback/stream-based API that is more complex to bundle with modern Next.js edge/node runtimes.

---

### 2. Notion Export Archive Structure & Path Transformation

- **Decision**: Implement an in-memory two-pass parser:
  1. **Pass 1 (Discovery)**: Scan entries in the ZIP to find the primary `.md` file and map all image entries (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`) by their normalized relative paths.
  2. **Pass 2 (Asset Ingestion & Rewrite)**: Upload all extracted image buffers to MinIO under `blogs/${uuid}-${cleanName}`. Replace all occurrences of relative image references in the markdown text with the resulting public HTTPS MinIO URLs.
- **Key Findings from Real Archive (`57da3f8a-e1fe-4f43-9d0e-63f9abb55d9b_ExportBlock...zip`)**:
  - Structure:
    ```text
    Private & Shared/Thiết kế hướng đối tượng 3f798e2c5a1d806cbaebc06b09601803.md
    Private & Shared/Thiết kế hướng đối tượng/image.png
    Private & Shared/Thiết kế hướng đối tượng/image 1.png
    ...
    Private & Shared/Thiết kế hướng đối tượng/image 8.png
    ```
  - **Notion Page ID**: Notion exports append a 32-character hexadecimal hash prefixed with a space (` 3f798e2c5a1d806cbaebc06b09601803`) to the `.md` filename.
  - **Image Reference Syntax in Markdown**:
    `![image.png](Thi%E1%BA%BFt%20k%E1%BA%BF%20h%C6%B0%E1%BB%9Bng%20%C4%91%E1%BB%91i%20t%C6%B0%E1%BB%A3ng/image.png)`
    Notice that the folder path in Markdown is URL-encoded (`%E1%BA%BF...`) and space-encoded (`%20`).
  - **Resolution Algorithm**:
    For any image markdown match `![alt](src)` or `<img src="src">`:
    1. Decode `src` via `decodeURIComponent(src)`.
    2. Normalize path separators (replacing `\` with `/`).
    3. Match against the map of uploaded MinIO image assets based on suffix or relative directory location (e.g. matching `Thiết kế hướng đối tượng/image.png`).
    4. Replace the original `src` with the MinIO URL (`https://minio.dutai.site/...`).

---

### 3. Title, Slug & Summary Extraction

- **Decision**:
  - **Title**: Check the first line of the markdown for `# Heading`. If present, strip the `# ` prefix. Fallback to extracting the basename of the `.md` file with the 32-character hex suffix stripped (`filename.replace(/\s+[a-f0-9]{32}\.md$/i, '')`).
  - **Slug**: Sanitize the title using a Vietnamese-aware slugify function that converts diacritics (e.g. `đ` → `d`, `ê` → `e`, `à` → `a`) and formats to lowercase hyphenated kebab-case.
  - **Slug Collision**: Query `getBlogBySlugQuery(slug)` in PostgreSQL. If the slug already exists, return `isSlugDuplicate: true` in the API response so the UI highlights the input with a red border and validation message, requiring the admin to change it before submission (per clarified FR-008).
  - **Summary**: Locate the first non-empty, non-heading paragraph that does not consist solely of an image reference. Strip formatting tags/asterisks and truncate to 250 characters with an ellipsis (`...`).

---

### 4. Admin UI Integration Flow

- **Decision**: Add an "Nhập từ ZIP Notion" action button to the header of `/admin/blogs/create` (within `BlogForm.tsx`).
- **Rationale**:
  - Per clarified FR-009, content creators want to import into `BlogForm` so they can preview the rendered markdown side-by-side, inspect formatting, pick one or more internal authors (built in Feature 001), select tags, and save or publish.
  - The dialog provides drag-and-drop file upload, file validation (format `.zip`, size <= 50MB), a visual loading progress indicator, and actionable error messages.
  - Upon successful upload, `BlogForm` fields (`title`, `slug`, `summary`, `content`) are populated instantaneously, while `imageUrl` is left empty to allow dynamic OpenGraph thumbnail generation (per clarified FR-007).

---

### 5. MinIO Storage Bucket & Folder Convention

- **Decision**: Upload extracted blog images to `blogs/` folder in MinIO with content type detection from image file extensions (`.png` → `image/png`, `.jpg`/`.jpeg` → `image/jpeg`, `.webp` → `image/webp`, `.gif` → `image/gif`, `.svg` → `image/svg+xml`).
- **Rationale**:
  - Keeps blog post media organized separately from generic uploads (`uploads/`), event photos (`events/`), and moment snapshots (`moments/`).
  - `uploadToMinIO` already supports folder prefixing (`folder = 'blogs'`).
