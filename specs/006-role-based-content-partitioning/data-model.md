# Data Model & Authorization Schema: Role-Based Content Partitioning

**Feature**: `006-role-based-content-partitioning`  
**Date**: 2026-11-21  
**Status**: Ready for Implementation  

---

## 1. Domain Entities & Role Extensions

### 1.1 Extended `UserRole` Enum (`frontend/lib/enums/roles.ts`)

```typescript
export enum UserRole {
  ADMIN = 'admin',
  LEADER = 'leader',
  TEAMMATE = 'teammate',
  SUB_ADMIN = 'Sub-Admin',
  TRAINER = 'Trainer',
  MENTOR = 'MENTOR',
  HR = 'HR',
  PROJECT_DEVELOPER = 'Project Developer',
  EDUCATOR = 'Educator',
  WEB_DUT_AI = 'web dut ai',
  DUT_AI_QUIZ = 'DUT AI Quiz',
  HE_THONG_CHECKIN = 'He thong checkin',
  CONTENT = 'Content', // New role for content management partition
}
```

### 1.2 Functional Partitions

```typescript
export type FunctionalPartition = 'CONTENT_MANAGEMENT' | 'MEMBER_INFO'

export interface PartitionDefinition {
  id: FunctionalPartition
  name: string
  description: string
  requiredRoles: string[]
  routes: string[]
}

export const FUNCTIONAL_PARTITIONS: Record<FunctionalPartition, PartitionDefinition> = {
  CONTENT_MANAGEMENT: {
    id: 'CONTENT_MANAGEMENT',
    name: 'Quản lý nội dung',
    description: 'Chức năng biên tập, xuất bản nội dung câu lạc bộ (Blogs, Projects, Events, Moments, Album, SEO, Intro)',
    requiredRoles: ['Content', 'admin'],
    routes: [
      '/admin',
      '/admin/blogs',
      '/admin/projects',
      '/admin/events',
      '/admin/posts',
      '/admin/generations',
      '/admin/keywords',
      '/admin/introductions',
    ],
  },
  MEMBER_INFO: {
    id: 'MEMBER_INFO',
    name: 'Thông tin thành viên',
    description: 'Quản lý thông tin hồ sơ và portfolio cá nhân của thành viên',
    requiredRoles: [], // Accessible to all authenticated members
    routes: [
      '/admin/portfolio',
    ],
  },
}
```

---

## 2. Authorization & Role Matching Logic

### 2.1 Role Verification Function (`hasContentAccess`)

```typescript
/**
 * Checks if a user has permission to access the Content Management partition.
 * Allows users holding the 'Content' role or 'admin' role (case-insensitive).
 */
export function hasContentAccess(
  userOrRoles?: { role_names?: string[]; roles?: string[] } | string[] | null
): boolean {
  if (!userOrRoles) return false

  const rolesList: string[] = Array.isArray(userOrRoles)
    ? userOrRoles
    : userOrRoles.role_names || userOrRoles.roles || []

  if (!rolesList || rolesList.length === 0) return false

  return rolesList.some((role) => {
    const normalized = String(role).trim().toLowerCase()
    return normalized === 'content' || normalized === 'admin'
  })
}
```

---

## 3. Route Partitioning & Access Matrix

| Route Pattern | Target Zone | Minimum Required Role | Non-Content Member Action | Unauthenticated Guest Action |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/blogs/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/projects/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/events/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/posts/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/generations/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/keywords/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/introductions/*` | Quản lý nội dung | `Content` or `admin` | Redirect to `/admin/portfolio?denied=content` | Redirect to SSO Login Portal |
| `/admin/portfolio` | Thông tin thành viên | Any authenticated role | Granted full access | Redirect to SSO Login Portal |
| `/admin/portfolio/*` | Thông tin thành viên | Any authenticated role | Granted full access | Redirect to SSO Login Portal |

---

## 4. UI Navigation Item Schema

```typescript
export interface NavItemConfig {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  partition: FunctionalPartition
}

export interface NavSectionConfig {
  title: string
  partition: FunctionalPartition
  items: NavItemConfig[]
}
```
