# Technical Research & Architectural Decisions: DUT-AI SSO Integration

**Feature**: DUT-AI Ecosystem Single Sign-On (SSO) Integration  
**Date**: 2026-11-20  
**Status**: Completed  

---

## 1. Protected Route Strategy & Middleware Architecture

### Decision
Implement an edge-compatible Next.js Middleware (`frontend/middleware.ts`) that intercepts incoming HTTP requests.
- **Protected Routes**:
  - All `/admin/:path*` routes (including `/admin` dashboard, blogs, projects, users, moments, portfolio manager).
  - Visiting `/admin/login` directly will automatically redirect to the central authentication portal (`https://workspace.dutai.io.vn/login?redirect=...`) rather than showing a disconnected local login form.
  - Future authenticated personal routes (e.g. `/profile`, `/settings`).
- **Public Routes (Bypassed)**:
  - Homepage (`/`), about (`/about`), public blogs (`/blog`, `/blog/:slug*`), public events (`/events`, `/events/:id*`), public projects (`/projects`, `/projects/:id*`), public member portfolios (`/members/:username*`).
  - Next.js internal paths: `/_next/static`, `/_next/image`, `favicon.ico`, static files (`robots.txt`, `sitemap.xml`).
  - Public API endpoints: `/api/public/:path*`, `/api/og/:path*`, `/api/homepage`, public blog/events GET routes.

### Rationale
A public-facing club website requires high SEO performance, zero crawl friction for search engine spiders, and instant loading for public visitors. Blanket-protecting the entire domain would destroy public visibility and break external links. Explicitly guarding private/administrative routes provides ironclad security where needed while preserving public accessibility.

### Alternatives Considered
- *Full-site authentication guard*: Rejecting all unauthenticated traffic was rejected because `dut-ai-web` is the primary public face of the DUT AI Club (showcasing events, articles, members, and recruitment).
- *Client-side only routing guards (`useEffect`)*: Rejected because client guards cause a noticeable "flash of protected content" (FOUC) and leak sensitive HTML skeletons to unauthenticated users.

---

## 2. Shared Cookie Domain (`.dutai.io.vn`) vs Localhost Development

### Decision
Implement an environment-aware cookie utility (`frontend/lib/auth/cookies.ts`) that configures the cookie domain dynamically:
- **Production / Subdomains (`*.dutai.io.vn`)**:
  - Cookie Domain: `.dutai.io.vn` (leading dot ensures all subdomains share cookies).
  - Secure: `true` (HTTPS enforced).
  - SameSite: `'lax'` (allows cookies to be sent on top-level cross-subdomain navigations).
  - Path: `'/'`.
- **Local Development (`localhost`, `127.0.0.1`, `NODE_ENV !== 'production'`)**:
  - Cookie Domain: `undefined` (omitted so the browser binds the cookie strictly to the local host).
  - Secure: `false` (enables HTTP testing without SSL certificate errors).
  - Support fallback local token mechanism (e.g. `.env.local` variable `DEV_FALLBACK_ACCESS_TOKEN` or manual cookie input on `/api/dev/auth`) to allow developers to build and test protected features without requiring a live VPN or production subdomains.

### Rationale
Per RFC 6265, web browsers will reject any cookie where the `Domain` attribute does not match or is not a suffix of the current host. Setting `Domain=.dutai.io.vn` while accessing `http://localhost:3000` causes modern browsers (Chrome, Safari, Firefox) to discard the cookie entirely. By abstracting cookie domain resolution, both production cross-subdomain SSO and local development workflows function seamlessly.

### Alternatives Considered
- *Requiring `/etc/hosts` override (mapping `127.0.0.1` to `local.dutai.io.vn`)*: Viable for advanced developers, but creates high friction for contributors and fails in automated headless CI environments.
- *Bypassing auth entirely in development*: Rejected because developers need to test RBAC permissions, profile rendering, and logout behavior locally.

---

## 3. Fast Edge Token Validation vs Central IdP Verification

### Decision
Adopt a two-tier verification model:
1. **Tier 1 (Edge / Middleware)**:
   - Extract `access_token` from `request.cookies`.
   - Perform lightweight Base64 decode of the JWT payload to read expiration (`exp`).
   - If `token` is missing or `exp < Date.now() / 1000`, immediately intercept and redirect to `https://workspace.dutai.io.vn/login?redirect={encodeURIComponent(request.url)}`.
   - Does **NOT** perform network I/O in middleware, maintaining sub-millisecond middleware execution times.
2. **Tier 2 (Server Component / API Route / React Context)**:
   - Call `https://manage.dutai.io.vn/api/v1/auth/me` with header `Cookie: access_token={token}` or `Authorization: Bearer {token}`.
   - Cache user profile data in memory / React Request Cache (`cache()`) during SSR to prevent redundant requests during a single page render.
   - Return structured user profile: `id`, `name`, `email`, `avatar_url`, `role_names`, and `permissions`.

### Rationale
Calling an external HTTP API on every single edge request in Next.js Middleware adds 150ms–400ms of latency per request and makes the entire web application vulnerable to downtime if `manage.dutai.io.vn` experiences transient network delays. Fast edge JWT decoding validates freshness and token structure instantly, while the backend API verifies authoritative identity and fresh permissions when loading data.

### Alternatives Considered
- *Full cryptographic signature verification on Edge using `jose` or `jsonwebtoken`*: Feasible, but requires distributing the IdP's JWT public key / secret to all sub-applications. If the IdP rotates keys, all sub-applications break unless JWKS endpoints are polled. Inspecting `exp` on Edge and letting `manage.dutai.io.vn/api/v1/auth/me` perform authoritative cryptographic validation is more resilient and decouples key management.

---

## 4. Single Sign-Out (SLO) Architecture

### Decision
Implement the Single Sign-Out flow via `POST /api/auth/logout`:
1. Server route issues HTTP response headers clearing both `access_token` and `refresh_token` across the parent domain:
   ```http
   Set-Cookie: access_token=; Domain=.dutai.io.vn; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure
   Set-Cookie: refresh_token=; Domain=.dutai.io.vn; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure
   ```
2. Also clears legacy cookies (`dut_admin_session`, `dut_admin_user`) on the current origin to avoid stale session state.
3. Client-side state resets immediately and redirects the user to the Central Auth Portal: `https://workspace.dutai.io.vn/login`.

### Rationale
Because `access_token` and `refresh_token` are `HttpOnly`, client-side JavaScript (`document.cookie = ...`) cannot delete them. A server endpoint returning explicit `Set-Cookie: ... Max-Age=0` with `Domain=.dutai.io.vn` is mandatory for RFC-compliant deletion across all subdomains.

### Alternatives Considered
- *Redirecting directly to `https://workspace.dutai.io.vn/logout`*: If the central workspace does not have an open redirect callback or if user is on this app, clearing cookies on the shared domain locally first ensures the user is definitively logged out on this application even if offline.

---

## 5. Client State & UI Integration

### Decision
1. **SSO Auth Provider (`frontend/context/SsoAuthContext.tsx`)**:
   - Manages client-side authentication state (`user`, `isAuthenticated`, `isLoading`, `hasRole`, `hasPermission`, `logout`).
   - Fetches `/api/auth/me` on mount if not provided by server props.
2. **Global Navigation (`frontend/components/Header.tsx`)**:
   - When authenticated: Displays user avatar, display name, and a dropdown menu with links to "Admin Dashboard" (if `roles.includes('admin')`), "Hồ sơ cá nhân", and "Đăng xuất".
   - When unauthenticated: Displays an elegant "Đăng nhập" button linking to `https://workspace.dutai.io.vn/login?redirect={encodeURIComponent(currentUrl)}`.
3. **Admin Layout (`frontend/app/admin/layout.tsx`)**:
   - Replaces the legacy `getCookieUser()` helper with the new SSO user context, displaying the verified `avatar_url`, `name`, and `role_names`.

### Rationale
Unifies the visual design and session awareness across both public marketing pages and restricted administrative portals, giving users clarity about their logged-in identity across the ecosystem.
