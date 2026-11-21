# Module & Import Contracts: Feature-Driven Architecture

**Feature**: `007-feature-driven-architecture`  
**Date**: 2026-11-21  

## 1. Import Rules and Dependency Direction

To maintain clean architecture and prevent spaghetti coupling:

1. **Hierarchy Order (Allowed imports)**:
   ```
   app/ (Pages, Layouts, Route Handlers)
     ↓ can import from
   features/*, components/*, lib/*
   
   features/*
     ↓ can import from
   components/ui, components/layout, components/common, lib/*
   
   components/* (UI / Layout / Common)
     ↓ can import from
   lib/* (cn, types)
   ```
2. **Forbidden Imports**:
   - ❌ `components/ui/*` MUST NOT import from `features/*`.
   - ❌ `features/A` MUST NOT import directly from `features/B`. If two features share logic, extract it to `lib/` or `types/`.
   - ❌ `lib/*` MUST NOT import from `features/*` or `components/*`.

## 2. Path Alias Definitions in `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/data/*": ["./data/*"],
      "@/app/*": ["./app/*"]
    }
  }
}
```

## 3. Public Barrel Exports (`index.ts`)

Each feature module under `frontend/features/<domain>/` SHOULD expose an optional `index.ts` or allow direct subfolder imports:

```typescript
// Example: features/blog/index.ts
export * from './components/BlogListLayout';
export * from './components/PostLayoutAPI';
export * from './components/MarkdownEditor';
export * from './components/NotionZipImportDialog';
```

## 4. Contract Stability

- **Server Action signatures**: No changes to function signatures in `app/admin/*/actions.ts`.
- **Public URL routing**: All URLs (`/`, `/blog`, `/blog/[slug]`, `/events`, `/projects`, `/members/[username]`, `/admin/*`) remain 100% identical.
- **REST APIs**: All API endpoints under `/api/*` remain unchanged.
