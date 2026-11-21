# Component Contracts: Portfolio UI Components

## 1. `PortfolioParticles`
```typescript
interface PortfolioParticlesProps {
  particleCount?: number
  className?: string
}
```
- Client-only canvas component (`'use client'`).
- Animates subtle glowing starry dust particles drifting slowly across the screen.
- Auto-pauses when off-screen or when `prefers-reduced-motion` is active.

## 2. `PortfolioHero`
```typescript
interface PortfolioHeroProps {
  name: string
  headline?: string | null
  quote?: string | null
  avatarUrl?: string | null
  clubRole?: string | null
  socialLinks: {
    github?: string | null
    linkedin?: string | null
    facebook?: string | null
    website?: string | null
  }
}
```
- Emits:
  - Hero introduction with "Hi There! 👋" and bold name.
  - Typewriter rotating through headline phrases and club role.
  - Tiltable avatar card on hover.
  - DUT-AI Blue accented social links.

## 3. `PortfolioAbout`
```typescript
interface PortfolioAboutProps {
  name: string
  bio?: string | null
  quote?: string | null
  clubRole?: string | null
  skills: SkillCategory[]
  githubUsername?: string | null
}
```
- Emits:
  - "Know Who I'M" biography card with quote footer.
  - "Professional Skillset" icon grid.
  - "Tools I use" icon grid.
  - "Days I Code" GitHub activity calendar (only when githubUsername is present).

## 4. `PortfolioProjects`
```typescript
interface PortfolioProjectsProps {
  projects: UnifiedProject[]
}
```
- Emits:
  - "My Recent Works" heading with project count.
  - Showcase cards featuring image thumbnails, descriptions, technology badges, GitHub button, and Live Demo button.
  - Club projects include the official DUT-AI Club verified badge.

## 5. `PortfolioResume`
```typescript
interface PortfolioResumeProps {
  cvUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
}
```
- Emits:
  - Dual "Download CV" action buttons (top & bottom).
  - Document preview frame or fallback download card.
