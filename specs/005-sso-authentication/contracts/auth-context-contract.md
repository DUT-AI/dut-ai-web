# Client & Context Contracts: DUT-AI SSO Integration

**Feature**: DUT-AI Ecosystem Single Sign-On (SSO) Integration  
**Date**: 2026-11-20  
**Status**: Ready  

---

## 1. SSO Auth Context Interface (`frontend/context/SsoAuthContext.tsx`)

```typescript
import { createContext, useContext, ReactNode } from 'react';
import { DutAiUserProfile } from '@/lib/auth-sso';

export interface SsoAuthContextValue {
  /** The verified user profile or null if unauthenticated */
  user: DutAiUserProfile | null;
  
  /** Indicates whether initial session check or profile fetch is currently in progress */
  isLoading: boolean;
  
  /** Convenience flag: true when user is verified and present */
  isAuthenticated: boolean;
  
  /** Any error encountered during session resolution */
  error: string | null;
  
  /** Helper to verify if user has a specific role (e.g. 'admin') */
  hasRole: (role: string) => boolean;
  
  /** Helper to verify if user has any of the specified roles */
  hasAnyRole: (roles: string[]) => boolean;
  
  /** Helper to verify if user has a specific granular permission */
  hasPermission: (permission: string) => boolean;
  
  /** Refetches the current user profile from /api/auth/me */
  refresh: () => Promise<void>;
  
  /** Executes the single sign-out flow and redirects to central portal */
  logout: () => Promise<void>;
}

export function useSsoAuth(): SsoAuthContextValue;
```

---

## 2. Server Utilities Contract (`frontend/lib/auth-sso.ts`)

```typescript
import { DutAiUserProfile } from '@/lib/auth-sso';

/**
 * Fetches the user profile from Central IdP using access_token.
 * Cached per request on server-side using React cache().
 */
export async function fetchCurrentSsoUser(accessToken: string): Promise<DutAiUserProfile | null>;

/**
 * Parses JWT payload (Base64) to inspect expiration and claims without cryptographic overhead.
 */
export function decodeJwtPayload(token: string): Record<string, any> | null;

/**
 * Verifies whether a JWT token string is structured properly and not expired.
 */
export function isTokenValid(token: string): boolean;

/**
 * Returns cookie options adapted to current environment (production .dutai.io.vn vs local localhost).
 */
export function getSsoCookieOptions(isLogout?: boolean): {
  domain: string | undefined;
  path: string;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax';
  secure: boolean;
};
```

---

## 3. Navigation Header Contract (`frontend/components/Header.tsx`)

The Header will consume `useSsoAuth()`:
- **State A: Loading**:
  - Displays a subtle skeleton pill (width 96px, height 36px) to prevent layout shift.
- **State B: Authenticated**:
  - Displays a user avatar image (with fallback initials), display name, and a dropdown trigger.
  - Dropdown items:
    - User Info header (Name + Email + Role badges).
    - Link to "Bảng quản trị (Admin)" (visible if `hasAnyRole(['admin', 'manager', 'editor'])`).
    - Link to "Hồ sơ cá nhân" (`/members/{username}` or `/admin/portfolio`).
    - "Đăng xuất" button (triggers `logout()`).
- **State C: Guest / Unauthenticated**:
  - Displays a sleek "Đăng nhập" button linking to `https://workspace.dutai.io.vn/login?redirect={encodeURIComponent(currentUrl)}`.
