# UI Contracts & Component Specifications

**Feature**: `004-member-portfolios`
**Date**: 2026-11-20

## 1. Public Portfolio View Components (`components/portfolio/`)

### A. `PortfolioHero`
Displays top header banner with avatar, greeting, animated headline, and primary call-to-actions.

```typescript
export interface PortfolioHeroProps {
  name: string
  headline?: string | null
  quote?: string | null
  avatarUrl?: string | null
  cvUrl?: string | null
  socialLinks: {
    github?: string | null
    linkedin?: string | null
    facebook?: string | null
    website?: string | null
  }
}
```

- **Visual Specs**:
  - Full-width hero container with subtle gradient border matching DUT-AI primary palette (`bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 to-transparent`).
  - Avatar: Circular 128x128px image with border and status badge ("DUT AI Member").
  - Title: Be Vietnam Pro typography, wave icon animation, responsive font sizing.
  - Social icon bar: `lucide-react` icons (`Github`, `Linkedin`, `Facebook`, `Globe`) with hover scale and tooltip.
  - Primary CTA buttons: "Xem CV / Tải Resume" and "Khám phá Dự án".

---

### B. `PortfolioAbout`
Detailed biography section presenting the member's journey, interests, and club role.

```typescript
export interface PortfolioAboutProps {
  bio?: string | null
  quote?: string | null
  clubRole?: string | null
  joinedDate?: string | null
}
```

---

### C. `PortfolioSkills`
Categorized skillset grid rendering professional competencies.

```typescript
export interface SkillCategory {
  category: string
  items: string[]
}

export interface PortfolioSkillsProps {
  skills: SkillCategory[]
}
```

- **Visual Specs**:
  - Responsive 2-column or 3-column card grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Each category card has subtle glassmorphism / card styling (`bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-xl p-5`).
  - Skill pills: `inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50`.

---

### D. `PortfolioProjects`
Unified project gallery displaying all projects (both verified club projects and personal projects together in one clean grid).

```typescript
export interface ProjectItem {
  id: number
  title: string
  description?: string | null
  imageUrl?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
  technologies?: string | null
  isClubProject: boolean
  clubRole?: string | null
}

export interface PortfolioProjectsProps {
  projects: ProjectItem[]
}
```

- **Visual Specs**:
  - Responsive 1-col / 2-col / 3-col grid displaying all projects in a single cohesive showcase.
  - Club projects include an official "DUT AI Club Verified" badge and member's role (e.g., "Frontend Lead").
  - Card interaction: Smooth hover lift (`hover:-translate-y-1 transition duration-200`), image cover with fallback SVG thumbnail.
  - Action buttons: "Demo", "Source Code", "Chi tiết".

---

### E. `PortfolioResume`
Resume viewing and downloading station.

```typescript
export interface PortfolioResumeProps {
  cvUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
  lastUpdated?: string | null
}
```

- **Visual Specs**:
  - Embedded preview container: `<object>` with 800px min-height on desktop screens.
  - Action bar: Direct Download button with file size label (e.g. `1.4 MB`), Open in New Window button.
  - Mobile fallback notice: "Xem tốt nhất trên màn hình lớn hoặc tải về thiết bị của bạn".

---

## 2. Admin / Profile Management Components (`components/admin/portfolio/`)

### A. `PortfolioEditForm`
Form with real-time validation for username handle, headline, bio, and social links.

- **Username Input**: Live debounced check against reserved keywords and database uniqueness. Shows immediate green check or red conflict alert.
- **Skills Editor**: Tag-based input allowing users to create categories and press `Enter` to add skill badges.

### B. `CvUploader`
Drag-and-drop zone with instant PDF file validation:
- Enforces `.pdf` extension and `application/pdf` MIME check.
- Shows file size gauge (must be <= 10MB).
- Progress indicator during upload to MinIO.
- Preview / Remove button once uploaded.
