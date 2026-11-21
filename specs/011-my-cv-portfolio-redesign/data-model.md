# Data Model & Component Contracts: My-CV Portfolio Redesign

## 1. Domain Entities & Type Definitions

The existing schema in `features/users/db/types.ts` is leveraged and mapped cleanly to the `my-cv` visual layout:

```typescript
export interface MemberPortfolioProfile {
  id: number
  userId: number
  name: string
  username: string
  avatarUrl: string | null
  headline: string | null
  quote: string | null
  bio: string | null
  clubRole: string | null
  generation: string | null
  isPublic: boolean
  socialLinks: {
    github?: string | null
    linkedin?: string | null
    facebook?: string | null
    website?: string | null
    twitter?: string | null
  }
  skills: SkillCategory[]
  projects: UnifiedProject[]
  cv?: {
    id: number
    fileName: string
    fileUrl: string
    fileSize: number
    uploadedAt: Date | string
  } | null
}
```

## 2. Skill Category Partitioning (for Techstack vs. Toolstack)

In `my-cv`, skills are visually partitioned into two sections:
1. **Professional Skillset (Techstack)**: Programming languages, frameworks, core technologies (Python, TypeScript, React, Next.js, Node.js, PyTorch, SQL, Docker, etc.).
2. **Tools I Use (Toolstack)**: Development environments and productivity tools (VS Code, Postman, Git, GitHub, Slack, Figma, Linux/MacOS).

If the member's database `skills` array contains categories labeled "Tools" or "Công cụ", they are routed to the Toolstack grid; all other categories are rendered in the Techstack grid.

## 3. GitHub Calendar Contract

Extract the username from `profile.socialLinks.github` (e.g., `https://github.com/phuocnguyen2412` -> `phuocnguyen2412`).
- **Endpoint**: GitHub public contribution API / GraphQL or styled contribution component.
- **Color Scale (DUT-AI Blue)**:
  - Level 0: `#1e293b` (slate-800)
  - Level 1: `#1d4ed8` (blue-700)
  - Level 2: `#2563eb` (blue-600)
  - Level 3: `#3b82f6` (blue-500)
  - Level 4: `#60a5fa` (blue-400)
