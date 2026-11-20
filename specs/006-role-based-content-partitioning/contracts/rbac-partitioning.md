# Interface Contract: Role-Based Access Control Partitioning

**Module**: `frontend/lib/enums/roles.ts` & `frontend/lib/admin-auth.ts`  
**Feature**: `006-role-based-content-partitioning`  
**Date**: 2026-11-21  

---

## 1. Helper Signatures & Contracts

### 1.1 `hasContentAccess`
```typescript
/**
 * Evaluates whether a user or array of role names has authorization for the Content Management partition.
 *
 * @param userOrRoles - User profile object, JWT payload, or array of role strings.
 * @returns boolean - true if user has 'Content' or 'admin' role (case-insensitive).
 */
export function hasContentAccess(
  userOrRoles?: { role_names?: string[]; roles?: string[] } | string[] | null
): boolean
```

### 1.2 `requireContentSession` (Server-Only Guard)
```typescript
/**
 * Server guard function for Next.js Server Actions and Route Handlers.
 * Verifies that the caller has an active authenticated session AND holds Content management authorization.
 *
 * @throws Error('UNAUTHORIZED') if user is unauthenticated.
 * @throws Error('FORBIDDEN_CONTENT_ROLE_REQUIRED') if user lacks the Content or Admin role.
 * @returns Promise<AdminSession> - Authenticated session with validated user.
 */
export async function requireContentSession(): Promise<AdminSession>
```

### 1.3 `getPartitionForPath`
```typescript
/**
 * Maps a given URL pathname to its respective functional partition.
 *
 * @param pathname - Request pathname (e.g. '/admin/blogs', '/admin/portfolio')
 * @returns 'CONTENT_MANAGEMENT' | 'MEMBER_INFO' | 'PUBLIC'
 */
export function getPartitionForPath(pathname: string): 'CONTENT_MANAGEMENT' | 'MEMBER_INFO' | 'PUBLIC'
```

---

## 2. Server Action Response Contract

When a non-Content user invokes an administrative mutation action directly, all action functions MUST adhere to the following contract response:

```typescript
export interface ActionFailureResponse {
  success: false
  error: 'FORBIDDEN_CONTENT_ROLE_REQUIRED' | 'UNAUTHORIZED' | string
  message: string
}

// Example failure return:
{
  success: false,
  error: 'FORBIDDEN_CONTENT_ROLE_REQUIRED',
  message: 'Bạn không có quyền thực hiện thao tác này. Cần vai trò Content hoặc Quản trị viên.'
}
```

---

## 3. Client Context Extension (`SsoAuthContext`)

`useSsoAuth()` hook will expose a helper convenience property:

```typescript
export interface SsoAuthContextType {
  // Existing properties...
  user: DutAiUserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  logout: () => Promise<void>
  refreshSession: () => Promise<void>

  // New RBAC convenience properties:
  isContentManager: boolean // True if user has 'Content' or 'admin' role
}
```
