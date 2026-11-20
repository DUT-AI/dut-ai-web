# Research & Technical Decisions: Member Portfolio Profiles

**Feature**: `004-member-portfolios`
**Date**: 2026-11-20
**Status**: Completed

## 1. Username Generation, Uniqueness & Reservation Strategy

### Context & Problem
Every member needs a clean, human-readable URL at `/members/[username]`. When an account is created or first initialized, we must auto-assign a valid initial username without manual input, while allowing subsequent customization.

### Decision
- **Initial Username Generation Algorithm**:
  1. Take member's full name (from SSO / `getManageUsers()`), normalize by removing Vietnamese diacritics/accents (e.g., "Nguyễn Huỳnh Phước" → "nguyen huynh phuoc").
  2. Slugify: convert to lowercase, replace spaces and special characters with hyphens (e.g., "nguyen-huynh-phuoc").
  3. Truncate to maximum 24 characters.
  4. Collision check: If the slug already exists in `user_cv.username` or matches a reserved keyword, append the member's numeric user ID (e.g., `nguyen-huynh-phuoc-42`).
  5. Fallback: If name is empty, extract the prefix from their email address before the `@` symbol (e.g., `user@dutai.io.vn` → `user-42`).
- **Validation Rules**:
  - Regex: `^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$` (Length: 3 to 30 characters).
  - Only lowercase English letters, numbers, hyphens, and underscores. Cannot start or end with a hyphen/underscore.
- **Reserved Keywords Blocklist**:
  - `admin`, `api`, `blog`, `projects`, `about`, `events`, `members`, `member`, `login`, `logout`, `dashboard`, `settings`, `user`, `users`, `auth`, `public`, `static`, `rss`, `feed`, `sitemap`.

### Rationale
Provides immediate out-of-the-box working URLs for 100% of members while preventing routing collisions with top-level Next.js routes.

### Alternatives Considered
- *Using numeric IDs (`/members/42`)*: Too impersonal for a professional portfolio. Rejected in favor of vanity slugs with numeric fallback.
- *Requiring manual username creation before first view*: Creates an empty state barrier and fails SC-002 ("100% of members automatically receive a portfolio").

---

## 2. Database Schema & Data Modeling

### Context & Problem
The existing `user_cv` table only stores `id`, `user_id`, and `quote`. We need to store profile details, skills, social links, resume documents, and custom projects while integrating with the existing `projects` table.

### Decision
1. **Extend `user_cv` Table**:
   - Add columns:
     - `username`: `varchar(50)` (unique, indexed, non-null)
     - `headline`: `varchar(255)` (e.g. "Fullstack Developer & AI Enthusiast")
     - `bio`: `text`
     - `avatar_url`: `varchar(1000)` (custom avatar URL overriding default SSO avatar if specified)
     - `github_url`: `varchar(500)`
     - `linkedin_url`: `varchar(500)`
     - `facebook_url`: `varchar(500)`
     - `website_url`: `varchar(500)`
     - `skills`: `jsonb` (structured list of skills, e.g. `[{"category": "Languages", "items": ["Python", "TypeScript"]}]`)
     - `cv_file_url`: `varchar(1000)`
     - `cv_file_name`: `varchar(255)`
     - `cv_file_size`: `integer`
     - `is_public`: `boolean` (default: `true`)
     - `updated_at`: `timestamp`
2. **New Table `user_portfolio_projects`**:
   - Stores custom personal projects added directly by the member:
     - `id`: `serial` primary key
     - `user_id`: `integer` not null (indexed)
     - `title`: `varchar(255)` not null
     - `description`: `text`
     - `image_url`: `varchar(1000)`
     - `demo_url`: `varchar(1000)`
     - `repo_url`: `varchar(1000)`
     - `technologies`: `text` (comma-separated or string)
     - `display_order`: `integer` default 0
     - `created_at`, `updated_at`: timestamps
3. **Club Projects Aggregation**:
   - Query existing `projects` joined with `project_members`:
     ```sql
     SELECT p.*, pm.role 
     FROM projects p 
     INNER JOIN project_members pm ON p.id = pm.project_id 
     WHERE pm.external_user_id = :userId;
     ```
   - Zero data redundancy; updates to official club projects automatically reflect on member portfolios.

### Rationale
Extending `user_cv` avoids duplicate user-profile tables, while separating `user_portfolio_projects` allows clean relational CRUD operations for personal projects without concurrency conflicts in JSON blobs.

---

## 3. UI/UX Architecture & Conversion from `my-cv`

### Context & Problem
The reference repo `my-cv` relied on `react-bootstrap`, a 14KB un-scoped `style.css`, fixed purple colors (`#c770f0`), and heavy canvas animations (`react-tsparticles`). This violates DUT-AI's design rules and would break existing styling.

### Decision
1. **Rebuild with Tailwind CSS v4**:
   - Replicate the structural layout (Hero → About/Bio → Skills/Techstack → Projects → CV Preview) using Tailwind CSS v4 grid, flex, and container utilities.
   - Respect DUT-AI theme tokens: `bg-white dark:bg-gray-950`, text hierarchy, and system primary accent colors (Blue/Cyan `dut-ai` tones).
2. **Iconography**:
   - Replace `react-icons` with `lucide-react` (already bundled in `frontend`), supplemented by clean SVG devicons for tech logos.
3. **Motion & Visual Polish**:
   - Replace `react-tsparticles` (canvas-heavy) and `react-parallax-tilt` with lightweight Tailwind CSS gradients and `motion` (Framer Motion 13) for smooth entrance animations (staggered fades, subtle hover scale).
   - Eliminates 500KB+ of legacy JS and keeps frame rates at constant 60fps on mobile.

---

## 4. PDF CV Rendering & File Upload Strategy

### Context & Problem
`my-cv` used `react-pdf@5.7.1` which is incompatible with React 19 / Next.js 16 and pulls web workers from CDN. We need a reliable, high-performance way to upload and display CVs.

### Decision
1. **Upload Pipeline**:
   - Re-use existing `uploadToMinIO` utility in [frontend/lib/minio.ts](file:///Users/nguyenhuynh/Documents/projects/dut-ai-web/frontend/lib/minio.ts).
   - Dedicated folder: `resumes/`.
   - Validate server-side: MIME type must be `application/pdf`, file size <= 10MB.
2. **Display & Download Pipeline**:
   - On Desktop: Render an embedded PDF viewer using standard HTML `<object data={cv_file_url} type="application/pdf">` or native `<iframe>`, wrapped in a clean container with full-width toggle.
   - On Mobile / Fallback: If embedded display is restricted by the mobile browser, present an explicit "Xem CV" / "Tải xuống CV" (Download CV) button with file size metadata.
   - Zero extra client dependencies, instant load time, fully accessible.

---

## 5. Routing, Rendering Mode & SEO Metadata

### Context & Problem
Portfolio pages must be discoverable, crawlable by search engines, and display rich social cards when shared on social platforms (Zalo, LinkedIn, Facebook).

### Decision
- **Route**: `frontend/app/members/[username]/page.tsx`
- **Rendering**: Server Component with dynamic data fetching (`export const dynamic = 'force-dynamic'` or ISR with tag revalidation on profile update).
- **SEO / Metadata**:
  ```ts
  export async function generateMetadata({ params }): Promise<Metadata> {
    const profile = await getMemberPortfolioByUsername(params.username)
    if (!profile) return { title: 'Member Not Found | DUT AI Club' }
    return genPageMetadata({
      title: `${profile.name} - Portfolio | DUT AI Club`,
      description: profile.headline || profile.bio || `Khám phá hồ sơ cá nhân của ${profile.name} tại DUT AI Club.`,
      image: profile.avatarUrl || '/static/images/avatar.png',
      path: `/members/${params.username}`,
    })
  }
  ```
