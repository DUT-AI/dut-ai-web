# Quickstart & Verification Guide: DUT-AI SSO Integration

**Feature**: DUT-AI Ecosystem Single Sign-On (SSO) Integration  
**Date**: 2026-11-20  
**Status**: Ready  

---

## 1. Prerequisites

- Node.js 20+ and npm installed.
- Access to the DUT-AI development environment or staging subdomains.
- Valid DUT-AI account credentials for testing login at `https://workspace.dutai.io.vn/login`.

---

## 2. Local Environment Setup

### 2.1 Install & Run Development Server
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:3000`.

### 2.2 Localhost Cookie Handling
Because `localhost` does not share `.dutai.io.vn` cookies automatically:
1. For end-to-end integration testing with production domains, run a local domain alias or test on `*.dutai.io.vn` preview deployments.
2. In local development mode, developers can inject a test token by executing in the browser console:
   ```javascript
   document.cookie = "access_token=<YOUR_VALID_DUTAI_JWT>; path=/; max-age=86400";
   location.reload();
   ```
   Or use the developer helper endpoint at `/api/auth/me` to verify token parsing.

---

## 3. End-to-End Verification Scenarios

### Scenario 1: Unauthenticated Protected Route Access
1. Open an incognito browser window (ensuring no existing cookies).
2. Navigate directly to `http://localhost:3000/admin`.
3. **Expected Result**:
   - Browser immediately redirects to `https://workspace.dutai.io.vn/login?redirect=http%3A%2F%2Flocalhost%3A3000%2Fadmin`.
   - No flash of administrative UI or confidential content occurs.

### Scenario 2: Public Route Uninterrupted Browsing
1. In an incognito window, navigate to:
   - Homepage: `http://localhost:3000/`
   - Blog list: `http://localhost:3000/blog`
   - About page: `http://localhost:3000/about`
   - Public member portfolio: `http://localhost:3000/members/testuser`
2. **Expected Result**:
   - All pages load normally without any redirect.
   - Header shows the "Đăng nhập" button linking to `https://workspace.dutai.io.vn/login?redirect=...`.

### Scenario 3: Authenticated Shared Session Recognition
1. Log in at `https://workspace.dutai.io.vn/login`.
2. Navigate to `https://web.dutai.io.vn/admin` (or local test with cookie).
3. **Expected Result**:
   - User enters directly without login screen.
   - Header and Admin layout display user avatar, full name, and assigned roles.
   - User profile endpoint `/api/auth/me` returns 200 with full user data.

### Scenario 4: Single Sign-Out (Logout)
1. While logged in, click "Đăng xuất" in the user dropdown or admin sidebar.
2. **Expected Result**:
   - Server invokes `POST /api/auth/logout`.
   - Cookies `access_token` and `refresh_token` for `.dutai.io.vn` are deleted (`Max-Age=0`).
   - Browser redirects to `https://workspace.dutai.io.vn/login`.
   - Subsequent navigation to `/admin` prompts login redirect.

---

## 4. Automated Code Quality Checks

Run the project verification commands:
```bash
cd frontend
npm run lint
npm run build
```
Verify zero TypeScript compilation errors and zero lint warnings.
