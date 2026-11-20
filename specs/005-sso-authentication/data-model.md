# Data Model & Entity Specifications: DUT-AI SSO Integration

**Feature**: DUT-AI Ecosystem Single Sign-On (SSO) Integration  
**Date**: 2026-11-20  
**Status**: Ready  

---

## 1. Entities

### 1.1 `DutAiUserProfile`
Represents the authenticated identity payload provided by the centralized Identity Provider (`https://manage.dutai.io.vn/api/v1/auth/me`).

```typescript
export interface DutAiUserProfile {
  /** Unique user identifier within DUT-AI ecosystem */
  id: number | string;
  
  /** Full display name of the user */
  name: string;
  
  /** Verified organizational or personal email address */
  email: string;
  
  /** Publicly accessible URL for user avatar profile image */
  avatar_url?: string | null;
  
  /** Fallback avatar alias (for compatibility with legacy components) */
  avatar?: string | null;
  
  /** Array of assigned role names (e.g., ['admin', 'member', 'leader']) */
  role_names: string[];
  
  /** Array of specific permission keys granted to this user (e.g., ['blogs:publish', 'projects:write']) */
  permissions: string[];
  
  /** Account status: 'ACTIVE', 'INACTIVE', or 'SUSPENDED' */
  status?: string;
  
  /** Soft-deletion indicator */
  is_deleted?: boolean;
}
```

#### Validation & Constraints
- `id`: Non-empty string or positive integer.
- `name`: String, minimum 1 character, trimmed.
- `email`: Valid RFC 5322 email format.
- `role_names`: Array of non-empty strings. Defaults to `['member']` if empty.
- `permissions`: Array of non-empty strings. Defaults to `[]` if not present in IdP response.

---

### 1.2 `JwtTokenPayload`
Represents the decoded claims from the JWT `access_token` used for lightweight Edge/Middleware validation.

```typescript
export interface JwtTokenPayload {
  /** Subject identifier (User ID) */
  sub?: string | number;
  
  /** Email address */
  email?: string;
  
  /** Display name */
  name?: string;
  
  /** Expiration timestamp in seconds since Unix epoch */
  exp?: number;
  
  /** Issued at timestamp in seconds since Unix epoch */
  iat?: number;
  
  /** Array of user role identifiers */
  roles?: string[];
  
  /** Issuer claim */
  iss?: string;
  
  /** Audience claim */
  aud?: string | string[];
}
```

#### Validation Rules
- Token format must adhere to `header.payload.signature` (3 base64url segments).
- Expiration check: `Boolean(payload.exp && payload.exp * 1000 > Date.now())`. If expired, token is treated as invalid.

---

### 1.3 `SsoSession`
Represents the client/server session state encapsulation.

```typescript
export interface SsoSession {
  /** Raw JWT access token */
  accessToken: string;
  
  /** Optional renewal token */
  refreshToken?: string;
  
  /** Verified profile information (null if token valid but profile not yet fetched) */
  user: DutAiUserProfile | null;
  
  /** True when token is unexpired and recognized */
  isAuthenticated: boolean;
  
  /** Epoch timestamp in seconds when the session token expires */
  expiresAt?: number;
}
```

---

### 1.4 `CookieConfigOptions`
Defines parameters for setting and clearing cross-subdomain authentication cookies.

```typescript
export interface CookieConfigOptions {
  name: string;
  value: string;
  domain?: string;
  path: string;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
}
```

#### Cookie Settings by Environment:
| Parameter | Production (`*.dutai.io.vn`) | Local Development (`localhost`) |
| :--- | :--- | :--- |
| `name` | `access_token` / `refresh_token` | `access_token` / `refresh_token` |
| `domain` | `.dutai.io.vn` (leading dot) | `undefined` (omitted) |
| `path` | `/` | `/` |
| `maxAge` | 604800 (7 days) / 0 (on logout) | 604800 (7 days) / 0 (on logout) |
| `httpOnly` | `true` | `true` |
| `sameSite` | `'lax'` | `'lax'` |
| `secure` | `true` | `false` |

---

## 2. Route Protection Rules

```typescript
export type RouteProtectionType = 'protected' | 'public' | 'static';

export interface RouteRule {
  pattern: RegExp;
  type: RouteProtectionType;
  requiredRoles?: string[];
}

export const ROUTE_RULES: RouteRule[] = [
  // Static assets & Next.js internals
  { pattern: /^\/(_next|favicon\.ico|images|fonts|api\/public|api\/og)/, type: 'static' },
  
  // Administrative & restricted management areas
  { pattern: /^\/admin(\/.*)?$/, type: 'protected', requiredRoles: ['admin', 'manager', 'editor'] },
  
  // Future user private dashboard routes
  { pattern: /^\/(account|settings|dashboard)(\/.*)?$/, type: 'protected' },
  
  // Public marketing & informational routes (Catch-all for all other paths)
  { pattern: /^.*$/, type: 'public' },
];
```
