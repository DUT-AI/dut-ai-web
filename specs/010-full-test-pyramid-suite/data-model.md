# Data Model & Test Architecture: Full Test Pyramid Suite

**Feature**: `010-full-test-pyramid-suite`  
**Date**: 2026-11-21

## 1. Test Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                 E2E Tier (Playwright)                       │
│  - Public Navigation (Home, Blog, Detail, Events, Projects) │
│  - Responsive Mobile Nav Toggle                             │
│  - RBAC Partitioning (Login redirect, Content vs Member)    │
│  - Admin Smoke & Mutation Cleanup                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│             Integration Tier (tsx --test)                   │
│  - Route Handlers (/api/auth/*, /api/blogs, /api/projects)  │
│  - Next.js Request / Response mocking                       │
│  - Server Action authorization guards                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                 Unit Tier (tsx --test)                      │
│  - RBAC canAccessRoute / hasRole matrix                     │
│  - Vietnamese Name Normalization & Username Generator       │
│  - Event Timeline partition & ID prefixing (post-, pe-)     │
│  - Domain Zod Validators & Date Formatting                  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Test Fixtures & Mock Models

### A. SSO Session Mock (`Integration & E2E`)
```typescript
export interface MockSsoUser {
  id: string
  email: string
  fullName: string
  roles: ('Admin' | 'Content' | 'Member')[]
  isStaff: boolean
}

export const MOCK_CONTENT_ADMIN: MockSsoUser = {
  id: 'usr-content-01',
  email: 'content@dutai.io.vn',
  fullName: 'DUT AI Content Manager',
  roles: ['Content'],
  isStaff: true,
}

export const MOCK_REGULAR_MEMBER: MockSsoUser = {
  id: 'usr-member-01',
  email: 'member@dutai.io.vn',
  fullName: 'DUT AI Member',
  roles: ['Member'],
  isStaff: false,
}
```

### B. E2E Mutation Record Cleanup Model
```typescript
export interface E2ETestRecord {
  table: 'posts' | 'events' | 'portfolios'
  identifier: string // id or slug
  prefix: '[E2E-TEST]'
}
```

## 3. NPM Script Hierarchy

| Command | Target | Execution Time Target | When to Run |
|---|---|---|---|
| `npm run test:unit` | `tests/unit/*.test.ts` | < 3s | On every file save / pre-commit |
| `npm run test:integration` | `tests/integration/*.test.ts` | < 5s | After API or query changes |
| `npm run test` | Unit + Integration | < 8s | Pre-commit hook & CI fast gate |
| `npm run test:e2e` | `tests/e2e/*.spec.ts` | < 30s | Pre-merge & deployment audit |
| `npm run test:all` | Unit + Integration + E2E | < 40s | Full release verification |
