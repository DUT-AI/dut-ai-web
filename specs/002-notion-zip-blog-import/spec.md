# Feature Specification: Notion ZIP Blog Post Import

**Feature Branch**: `002-notion-zip-blog-import`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Tôi muốn thêm 1 chức năng tạo bằng gửi file zip notion. Đây là ví dụ @57da3f8a-e1fe-4f43-9d0e-63f9abb55d9b_ExportBlock-722b653a-bd16-4c90-a03f-c6ab043354dc.zip"

## Clarifications

### Session 2026-10-14
- Q: Khi trích xuất bài viết từ file ZIP Notion, hệ thống nên xử lý ảnh bìa (cover image / imageUrl) như thế nào? (FR-007) → A: Không tự gán ảnh bìa: Để trống ô Ảnh bìa để hệ thống tự động sinh thumbnail OpenGraph từ tiêu đề và tác giả, admin tự upload ảnh bìa riêng nếu cần.
- Q: Khi slug được tạo tự động từ tiêu đề bài viết Notion đã tồn tại trong hệ thống, cơ chế xử lý nên như thế nào? (FR-008) → A: Giữ nguyên slug được trích xuất nhưng đánh dấu viền đỏ / hiển thị lỗi "Slug đã tồn tại, vui lòng thay đổi" và chặn lưu cho đến khi admin đổi.
- Q: Khi người quản trị tải lên file ZIP Notion, quy trình thao tác và luồng xuất bản bài viết nên diễn ra như thế nào? (FR-009) → A: Điền trước vào form soạn thảo (BlogForm): Tải ZIP ngay trên trang /admin/blogs/create, tự động điền dữ liệu vào form để admin xem live preview, chọn tác giả, thêm tags rồi mới lưu.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import Blog Post from Notion Export ZIP (Priority: P1)

As an administrator or content creator, I want to upload a standard ZIP archive exported from Notion so that the article title, content, and embedded images are automatically extracted, uploaded, and mapped into the blog management form without manual copy-pasting.

**Why this priority**: Content creators frequently write in Notion due to its collaborative features. Manually downloading images from Notion, re-uploading each to MinIO, copying markdown, and rewriting links is tedious and error-prone. This feature automates the entire ingestion pipeline.

**Independent Test**: An admin clicks "Nhập từ ZIP Notion" on `/admin/blogs/create`, selects a standard Notion export ZIP (containing a `.md` file and an asset folder with images), and the form is automatically populated with the parsed title, slug, summary, content, and rewritten image URLs pointing to MinIO.

**Acceptance Scenarios**:

1. **Given** an admin is on `/admin/blogs/create`, **When** they upload a valid Notion export ZIP file, **Then** the system extracts the markdown file, extracts the title, suggests a URL-friendly slug, extracts a summary snippet, and populates the Markdown editor.
2. **Given** a Notion export ZIP containing embedded images, **When** processed, **Then** all image assets are uploaded to MinIO storage and relative markdown image paths (e.g. `![image.png](folder/image%201.png)`) are rewritten to persistent public MinIO URLs (`https://minio.dutai.site/...`).
3. **Given** the form is populated from the ZIP, **When** the admin selects authors, reviews the live preview, and submits, **Then** the blog post is saved to the database and displays identically to the original Notion layout.

---

### User Story 2 - Image Asset Processing and Path Transformation (Priority: P2)

As a content manager, I want all images inside the Notion ZIP to be seamlessly preserved, uploaded with proper MIME types, and linked in the markdown body so that diagrams, equations, and screenshots render reliably for readers.

**Why this priority**: Notion exports use URL-encoded folder names and relative paths (e.g. `Thi%E1%BA%BFt%20k%E1%BA%BF.../image.png`). If path rewriting fails, broken image placeholders appear across the article.

**Independent Test**: Upload a Notion ZIP containing 8+ images. In the Markdown preview pane and on the public post page, all 8 images render with valid image URLs without 404 broken links.

**Acceptance Scenarios**:

1. **Given** a ZIP with multiple images in nested asset directories, **When** uploaded, **Then** each image is parsed, named uniquely, and uploaded to the `blogs/` MinIO bucket.
2. **Given** image paths with special characters or Vietnamese diacritics in the Notion markdown, **When** the rewrite engine runs, **Then** both raw and URL-encoded markdown image references are correctly resolved and replaced with MinIO URLs.
3. **Given** a Notion ZIP with or without images, **When** imported, **Then** the cover image field (`imageUrl`) is left empty by default to leverage the system's dynamic OpenGraph thumbnail generator, allowing the admin to upload a custom cover if desired.

---

### User Story 3 - Import Error Handling & Validation Feedback (Priority: P3)

As an administrator, I want clear and informative feedback if an uploaded ZIP file is invalid, corrupted, or exceeds size limits so that I understand why an import failed and how to rectify it.

**Why this priority**: Users may upload arbitrary or corrupted ZIP archives. Resilient validation protects server resources and provides a smooth editorial experience.

**Independent Test**: Upload an invalid ZIP file (no `.md` file or non-zip format); an immediate error toast/banner is displayed explaining the exact issue without crashing the form.

**Acceptance Scenarios**:

1. **Given** a ZIP archive containing no `.md` files, **When** uploaded, **Then** the system displays a clear error: "File ZIP không chứa tệp nội dung Markdown (.md) hợp lệ từ Notion."
2. **Given** a file exceeding the size limit (e.g. > 50MB), **When** selected, **Then** the system rejects the file before processing and informs the user of the size limit.
3. **Given** a duplicate slug generated from the Notion page title, **When** populated into the form, **Then** the extracted slug is placed in the input but marked with a red border and validation error message ("Slug đã tồn tại, vui lòng thay đổi"), preventing post submission until changed.
4. **Given** an administrator on `/admin/blogs/create`, **When** they click "Nhập từ ZIP Notion" and process a file, **Then** all extracted fields (title, slug, summary, content with rewritten MinIO URLs) are pre-populated into `BlogForm`, allowing the admin to inspect the live preview, choose authors, edit tags, and click "Tạo bài viết".

---

### Edge Cases

- What happens if a Notion ZIP contains multiple `.md` files (e.g., subpages or database export)?
- How does the system handle unsupported file formats found inside the asset directory (e.g., `.pdf`, `.zip`, `.mp4`)?
- What happens if the Notion markdown contains KaTeX math formulas (`$$ ... $$`) or Mermaid diagrams (are they preserved verbatim)?
- How does the system handle filename encoding quirks across different operating systems (macOS UTF-8 vs Windows CP437 ZIP encoding)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an interface in `/admin/blogs` allowing administrators to upload a Notion export ZIP file.
- **FR-002**: System MUST parse the ZIP archive, locate the primary `.md` markdown file, and extract the page title by stripping Notion's 32-character hexadecimal page ID or reading the top-level `# Title` heading.
- **FR-003**: System MUST automatically generate a URL-friendly slug from the extracted article title.
- **FR-004**: System MUST extract a summary excerpt from the first non-heading paragraph of the markdown document (up to 300 characters).
- **FR-005**: System MUST extract all image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`) from the ZIP archive and upload them to MinIO asset storage.
- **FR-006**: System MUST parse markdown image syntax (`![alt](path)`) and HTML `<img>` tags, matching relative Notion asset paths (accounting for URL encoding) and replacing them with uploaded MinIO URLs.
- **FR-007**: System MUST leave the cover image (`imageUrl`) field empty by default upon ZIP import, allowing the blog platform to dynamically generate an OpenGraph thumbnail from title and authors, while allowing the administrator to manually set/upload a cover image if desired.
- **FR-008**: System MUST retain the extracted slug in the input field when it conflicts with an existing blog post slug, display an inline visual validation error ("Slug đã tồn tại, vui lòng thay đổi") with a red border, and disable submission until the administrator inputs a unique slug.
- **FR-009**: System MUST integrate the ZIP import action directly into the `/admin/blogs/create` form page via a dedicated button/dialog, automatically pre-populating form state (title, slug, summary, markdown content) upon successful extraction, enabling the administrator to review live preview, select authors, specify tags, and submit using the standard creation flow.
- **FR-010**: System MUST validate file format and size, enforcing a maximum archive size of 50MB and verifying ZIP mime-types.
- **FR-011**: System MUST preserve all standard Markdown, code blocks, lists, callout quotes, and math formulas without corrupting special characters or diacritics.

### Key Entities

- **Notion Import Payload**: Represents the uploaded ZIP file, extracted metadata (`title`, `slug`, `summary`, `content`), and the map of local asset file paths to uploaded MinIO URLs.
- **Blog Post**: The target entity in the database populated with the transformed content and image URLs.
- **Media Asset**: Image files extracted from the archive and stored persistently in MinIO under the `blogs/` prefix.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Importing a standard Notion export ZIP (with 5-10 images and ~2,000 words) completes processing and form population in under 5 seconds.
- **SC-002**: 100% of embedded images referenced in the Notion markdown are successfully uploaded to MinIO and rendered without broken link errors.
- **SC-003**: Reduces time required to publish a Notion-drafted article to DUT-AI blog from ~15 minutes (manual copy/upload) to under 30 seconds.
- **SC-004**: 0% data corruption or encoding loss for Vietnamese characters, mathematical expressions, and programming code blocks.

## Assumptions

- Admins export Notion pages using the standard "Export -> Markdown & CSV -> Include subpages: off / assets: on" option.
- MinIO service is running and configured with write access via the existing S3 client in `frontend/`.
- Authors and tags will still be reviewed and selected by the administrator during or after the import process.
