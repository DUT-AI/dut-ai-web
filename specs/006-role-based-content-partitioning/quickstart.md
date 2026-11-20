# Quickstart & Verification Guide: Role-Based Content Partitioning

**Feature**: `006-role-based-content-partitioning`  
**Date**: 2026-11-21  

---

## 1. Prerequisites

- Next.js development server running (`npm run dev` in `frontend/`).
- Valid SSO authentication session or emulated test user profile.

---

## 2. Test Scenarios

### Scenario A: Content Role User Verification

1. **Setup**: Sign in as a user with `role_names: ["Content"]` or `role_names: ["content", "teammate"]`.
2. **Access Content Overview**:
   - Navigate to `http://localhost:3000/admin`.
   - **Expected Result**: Page loads successfully, displaying administrative metrics, recent blogs, and quick action cards.
3. **Inspect Sidebar**:
   - Check the admin sidebar.
   - **Expected Result**: Both section headers are present:
     - `QUẢN LÝ NỘI DUNG` (Tổng quan, Bài viết, Dự án, Sự kiện, Khoảnh khắc, Album thế hệ, Từ khóa, Giới thiệu).
     - `THÔNG TIN THÀNH VIÊN` (Hồ sơ cá nhân).
4. **Create / Edit Content**:
   - Navigate to `/admin/blogs` -> create a draft blog.
   - **Expected Result**: Blog mutation succeeds without error.
5. **Access Personal Portfolio**:
   - Navigate to `/admin/portfolio`.
   - **Expected Result**: Content user can also edit their personal portfolio.

---

### Scenario B: General Member (Non-Content) Verification

1. **Setup**: Sign in as a standard member with `role_names: ["teammate"]` or `role_names: ["Project Developer"]` (no Content role).
2. **Access Member Area**:
   - In the top header, click the user profile avatar dropdown.
   - **Expected Result**: The dropdown displays **only** "Hồ sơ cá nhân" linking to `/admin/portfolio`. The link "Bảng quản trị (Admin)" is NOT visible.
3. **Inspect Member Sidebar**:
   - Navigate to `http://localhost:3000/admin/portfolio`.
   - **Expected Result**:
     - The page loads the user's personal portfolio editor.
     - The sidebar displays **only** `THÔNG TIN THÀNH VIÊN` -> `Hồ sơ cá nhân (Portfolio)`.
     - None of the Content Management links (Blogs, Projects, etc.) are present.
4. **Direct Route Infiltration Test**:
   - Manually type `http://localhost:3000/admin` or `http://localhost:3000/admin/blogs` into the browser URL bar.
   - **Expected Result**:
     - The request is immediately intercepted.
     - User is redirected to `/admin/portfolio?denied=content`.
     - A toast message appears: *"Bạn không có quyền truy cập khu vực Quản lý nội dung. Đã chuyển hướng về Hồ sơ cá nhân."*
     - No restricted blog data or management tools are shown.
5. **Server Action Mutation Rejection**:
   - Attempt to call a blog creation or deletion action via developer tools or custom test script.
   - **Expected Result**: Action throws or returns `{ success: false, error: 'FORBIDDEN_CONTENT_ROLE_REQUIRED' }` and no database mutation occurs.

---

## 3. Automated Validation Commands

```bash
# 1. Typecheck and linting validation
cd frontend && npx tsc --noEmit && npm run lint

# 2. Production build validation
npm run build
```
