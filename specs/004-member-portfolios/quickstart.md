# Quickstart & Verification Guide: Member Portfolio Profiles

**Feature**: `004-member-portfolios`
**Date**: 2026-11-20

This guide provides step-by-step instructions to verify and validate the Member Portfolio Profiles feature end-to-end.

## Prerequisites

1. PostgreSQL database running (via Docker Compose: `docker compose up -d db` or local PostgreSQL instance).
2. MinIO storage service accessible (configured in `frontend/.env`).
3. Node.js 20+ installed.

---

## Step 1: Database Migration

Generate and apply the schema migration extending `user_cv` and creating `user_portfolio_projects`:

```bash
cd frontend

# Generate migration from updated schema
npm run db:generate

# Apply migration to database
npm run db:migrate
```

**Expected Outcome**: Migration completes successfully with new columns on `user_cv` (`username`, `headline`, `bio`, `avatar_url`, `github_url`, `linkedin_url`, `skills`, `cv_file_url`, etc.) and new table `user_portfolio_projects`.

---

## Step 2: Start Development Server

```bash
cd frontend
npm run dev
```

The application runs on `http://localhost:3000`.

---

## Step 3: Validation Scenarios

### Scenario 1: Initial Default Portfolio Access (P1)
1. Open browser and visit `/members/phuoc-nguyen` (or an active member slug).
2. **Verify**:
   - Page loads in under 1.5s with HTTP 200.
   - Header shows member name, avatar, headline, and quote.
   - Skills section shows categorized competencies.
   - Light/Dark theme toggle adapts all portfolio colors without contrast issues.

### Scenario 2: Non-Existent Username (Edge Case)
1. Visit `/members/non-existent-user-slug-999`.
2. **Verify**:
   - HTTP 404 status returned.
   - Polite "Không tìm thấy thành viên" UI is displayed with a link back to `/about` or `/`.

### Scenario 3: Profile & PDF CV Management (P2)
1. Log in to the admin/member area at `http://localhost:3000/admin`.
2. Navigate to `/admin/portfolio` (or user profile editor).
3. Update headline and bio, add skills, and upload a test PDF file (< 10MB).
4. Save changes.
5. **Verify**:
   - Success toast message appears.
   - Visiting `/members/[username]` displays the updated bio and skills.
   - PDF viewer and download button are visible and operational.

### Scenario 4: Username Customization & Collision Prevention (P2)
1. In `/admin/portfolio`, attempt to set username to `admin` or `api`.
2. **Verify**: Validation prevents submission with "Username is reserved".
3. Enter a username taken by another user.
4. **Verify**: Conflict error message appears.
5. Enter a valid unique handle (e.g., `my-custom-handle`).
6. **Verify**: Portfolio is now accessible at `/members/my-custom-handle`.

### Scenario 5: Club Project Synchronization (P3)
1. Link the member to an existing project in the database.
2. Visit `/members/[username]`.
3. **Verify**:
   - The project appears in the unified Projects gallery with an official "DUT AI Club Verified" badge and the member's role badge.
   - Clicking the project navigates to the detailed project page (`/projects/[id]`).

### Scenario 6: Discovery via Member Directory (P4)
1. Navigate to `/about`.
2. Scroll to the Generation Albums / Member list.
3. Click on a member's card or avatar.
4. **Verify**: Browser smoothly navigates to `/members/[username]`.

---

## Step 4: Quality & Lint Verification

Run lint and type checks to ensure zero regressions:

```bash
cd frontend
npm run lint
```
