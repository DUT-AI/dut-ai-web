# Feature Specification: Enhanced OpenGraph Thumbnails & Multi-Author Avatars

**Feature Branch**: `003-enhanced-og-thumbnails`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Tôi muốn chỉnh sửa lại phần tạo thumnail tự động, phần logo chỗ DUT AI CLUB thì lấy logo của clb @[/Users/nguyenhuynh/Documents/projects/dut-ai-web/frontend/public/static/images/logo.png], tác giả tôi muốn show avavtar của từng tác giả nếu có nhiều tác giả, trường hợp tác giả ko có avatar thì dùng Avatar mặc định là chữ cái đầu first name của tên tiếng việt, và tiếp theo là nghiên cứu vì sao ảnh này khi làm preview trên cách nền tảng mạng xã hội thì rất mờ"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Official Club Logo in OpenGraph Banner (Priority: P1)

When an OpenGraph thumbnail is generated dynamically for a blog post (or previewed in the Admin editor), the header branding must display the official DUT AI Club logo asset (`logo.png`) instead of a generic placeholder, maintaining high brand fidelity and visual polish.

**Why this priority**: Brand recognition and visual identity are critical when content is shared across social channels. The official logo provides immediate credibility and association with DUT AI Club.

**Independent Test**: Can be tested independently by calling `/api/og/blog/preview?title=Test` or inspecting any blog's generated image: the official club mascot/logo appears crisply in the top-left area alongside club identity text.

**Acceptance Scenarios**:
1. **Given** a blog post without an uploaded custom banner, **When** the OpenGraph image endpoint `/api/og/blog/[slug]` is requested, **Then** the generated banner renders the official club logo from `public/static/images/logo.png` in the header bar.
2. **Given** an admin editing or creating a blog post, **When** they preview the auto-generated thumbnail in the editor form, **Then** the official logo is clearly displayed without distortion or aspect ratio deformation.

---

### User Story 2 - Multi-Author Avatars with Vietnamese Initial Fallbacks (Priority: P1)

When a blog post has one or multiple authors, the thumbnail must display individual avatar portraits for each author in an avatar stack. If an author lacks a profile picture, the system automatically renders a fallback avatar circle containing the uppercase initial of their Vietnamese first name (tên gọi).

**Why this priority**: Multi-author attribution and contributor recognition are foundational to community-driven club publications. Personal branding on shared link previews significantly drives engagement.

**Independent Test**: Can be tested independently by requesting an OG image with a post having multiple authors (some with image URLs, some without): all authors appear in an avatar row or stack, and avatar-less authors show their Vietnamese first-name initial.

**Acceptance Scenarios**:
1. **Given** a post with multiple authors having avatar URLs, **When** the thumbnail is rendered, **Then** all author avatars are displayed in a clean, overlapping or spaced row alongside their names.
2. **Given** an author named "Huỳnh Phước Nguyên" with no avatar image, **When** the thumbnail is generated, **Then** a circular fallback avatar displays the letter "N" (initial of the Vietnamese first name "Nguyên").
3. **Given** an author named "Sơn Phan" with no avatar image, **When** the thumbnail is generated, **Then** a circular fallback avatar displays the letter of their Vietnamese first name.
4. **Given** a post with 4 or more co-authors, **When** space is constrained, **Then** the system renders the first 3 avatars and displays an overflow indicator (e.g. `+N`) or handles the layout without text clipping or layout breakage.

---

### User Story 3 - High-Resolution & Crisp Social Previews across Platforms (Priority: P2)

When links to blog posts are shared on social media platforms (Facebook, Zalo, Twitter/X, LinkedIn, Telegram), the preview card must render razor-sharp without blurriness, compression artifacts, or fuzzy text, both on standard desktop displays and mobile Retina/high-DPI screens.

**Why this priority**: Blurry preview cards dramatically reduce click-through rates and convey an amateur impression. Resolving the root causes of platform blurriness ensures content looks professional across all feeds.

**Independent Test**: Can be tested by inspecting the generated image dimensions, font rendering sharpness, OpenGraph metadata tags (`og:image:width`, `og:image:height`, `og:image:type`, `twitter:card: summary_large_image`), and long-lived cache headers.

**Acceptance Scenarios**:
1. **Given** a social media platform scraping a blog post URL, **When** it parses the HTML metadata, **Then** it receives fully qualified `og:image`, `og:image:width: 1200`, `og:image:height: 630`, `og:image:type: image/png`, and `twitter:card: summary_large_image` tags.
2. **Given** social media CDNs (Facebook, Zalo) caching the generated image, **When** they fetch the image endpoint, **Then** HTTP response headers specify durable caching (`Cache-Control: public, max-age=31536000, immutable` or appropriate CDN revalidation) preventing repetitive compressed re-fetches.
3. **Given** dynamic text containing Vietnamese diacritics (dấu tiếng Việt), **When** rasterized in the image generator, **Then** glyphs are rendered with proper font metrics and high contrast without pixelated or misaligned font fallback artifacts.

---

### Edge Cases

- **Single Word Author Name**: For names with only one token (e.g. "Admin" or "AI-Team"), the fallback initial is the first character ("A").
- **External Avatar Load Failure / Timeout**: If an author's remote avatar URL is broken, slow, or blocked by CORS, the generator must instantly fall back to the Vietnamese name initial avatar rather than failing the entire image generation.
- **Excessively Long Titles**: Titles exceeding 100 characters must scale font size dynamically and truncate gracefully with ellipsis rather than overflowing outside the canvas.
- **Many Co-Authors (5+)**: Layout adjusts author badge row to prevent pushing footer elements out of bounds.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST embed the official DUT AI Club logo (`frontend/public/static/images/logo.png`) directly into generated blog thumbnails.
- **FR-002**: System MUST support rendering author avatars for all co-authors associated with a blog post, accepting both profile image URLs and fallback initials.
- **FR-003**: System MUST compute the default avatar initial using the first character of the author's Vietnamese first name (the last word/token of the full name, uppercased).
- **FR-004**: System MUST gracefully fall back to the initial avatar if an author has no avatar URL or if an external avatar image fails to load.
- **FR-005**: System MUST serve generated OpenGraph images with dimensions optimized for high-DPI displays (1200x630 canvas with crisp vector geometry and legible typography).
- **FR-006**: System MUST ensure OpenGraph metadata on blog detail pages includes explicit `og:image:width`, `og:image:height`, `og:image:type`, and `twitter:card` set to `summary_large_image`.
- **FR-007**: System MUST set appropriate HTTP caching headers (`Cache-Control`) on generated OG endpoints to prevent social media crawlers from degrading or recompressing images unnecessarily.
- **FR-008**: System MUST update the admin blog editor preview endpoint `/api/og/blog/preview` to support passing author avatar URLs and displaying identical visual fidelity to the published version.

### Key Entities

- **BlogThumbnailPayload**: Data structure containing blog title, publication date, domain, and an array of author profiles.
- **AuthorProfile**: Represents a post contributor with `name`, optional `avatarUrl`, and computed `initial` character.
- **SocialMediaCardMetadata**: The set of OpenGraph and Twitter card metadata tags embedded in HTML head elements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of auto-generated thumbnails display the official club logo and author avatars (or initial fallbacks) without missing asset errors.
- **SC-002**: Vietnamese name initials correctly resolve the last name token for 100% of tested Vietnamese names (e.g., "Nguyễn Văn An" → "A", "Huỳnh Phước Nguyên" → "N").
- **SC-003**: Generated thumbnails achieve 100% test pass rate on social media validator tools (Facebook Sharing Debugger, Twitter Card Validator) with large summary card layout.
- **SC-004**: OpenGraph image generation latency remains under 350ms, ensuring social media crawler timeout tolerances (typically 3s) are comfortably met.

## Assumptions

- Official club logo file is located at `frontend/public/static/images/logo.png` and can be encoded as a base64 Data URL or loaded as an ArrayBuffer for Satori rendering.
- Vietnamese naming convention assumes the standard order `Họ + Tên đệm + Tên gọi`, where the final word token represents the "first name" (tên gọi).
- Image format produced by the dynamic generator remains PNG for maximum lossless clarity of text and vector shapes.
- The social media blurriness issue is caused by a combination of: (1) lack of explicit high-DPI font rendering, (2) aggressive crawler downsampling when `og:image:width`/`height` or `summary_large_image` are missing or misconfigured, and (3) volatile cache headers (`max-age=0`) forcing repeated proxy compression.
