# Phase 1: Quickstart & End-to-End Validation Guide

**Feature**: Standalone Blog Management System with Multi-Author Support (`001-standalone-blog-system`)  
**Date**: 2026-10-14  
**Status**: Ready  

This document outlines the step-by-step procedures to validate that the standalone blog system is functional, decoupled from the Quiz service, and correctly attributes multiple authors.

---

## 1. Prerequisites & Environment Setup

1. **Database & Services**:
   Ensure local PostgreSQL and MinIO are running:
   ```bash
   docker compose up -d db minio
   ```
2. **Schema Migration**:
   Apply Drizzle migration containing the restored `content` column on `blogs`:
   ```bash
   cd frontend && npx drizzle-kit push
   # or
   make db-push
   ```
3. **Start Development Server**:
   ```bash
   cd frontend && npm run dev
   ```

---

## 2. Validation Scenario 1: Create a Native Multi-Author Blog Post

**Goal**: Verify an administrator can write Markdown content directly in Admin, assign multiple authors, and publish without any Quiz API interaction.

1. Navigate to `http://localhost:3000/admin/blogs/create`.
2. Inspect the form:
   - ✅ Verify there is **NO** "Slug bài học (từ quiz.dutai.site)" field.
   - ✅ Verify there is **NO** "Tìm nạp từ Quiz" button or Quiz status message.
   - ✅ Verify the dedicated Markdown Editor is visible with formatting toolbar (Bold, Headings, Code, Lists, Links, Image upload).
3. Fill in the article details:
   - **Title**: `Giới thiệu Kiến trúc DUT AI 2026`
   - **Slug**: `gioi-thieu-kien-truc-dut-ai-2026`
   - **Summary**: `Tổng quan kiến trúc hệ thống và định hướng phát triển.`
   - **Content**:
     ```markdown
     # Chào mừng đến với DUT AI

     Đây là bài viết đầu tiên được lưu trữ trực tiếp trên hệ thống nội bộ!

     ```python
     def hello_dut():
         return "Standalone Blog is Live!"
     ```
     ```
   - **Authors**: Select at least 2 authors from the author checklist.
   - **Keywords**: Select or add 1-2 keywords.
4. Click **Live Preview** tab/toggle in the editor to verify Markdown renders formatted text and code blocks.
5. Click **Tạo bài viết** (Submit).
6. **Expected Outcome**:
   - System redirects to `/admin/blogs`.
   - The new blog post appears in the management list with both authors displayed.

---

## 3. Validation Scenario 2: Public Reader View & Zero Quiz Network Calls

**Goal**: Verify the public blog article displays local content and multiple authors while making zero network calls to the Quiz service.

1. Open DevTools Network tab.
2. Filter network requests for `quiz.dutai.site`.
3. Navigate to `http://localhost:3000/blog/gioi-thieu-kien-truc-dut-ai-2026`.
4. **Expected Outcome**:
   - Article renders with title, cover image, and full Markdown content (with syntax-highlighted code block).
   - In the author attribution section, **both selected authors** appear with their avatars and names.
   - **Zero** requests are made to `quiz.dutai.site` or `/api/lessons/by-slug/*`.
   - Page loads in < 500ms.

---

## 4. Validation Scenario 3: Legacy Blog Post Graceful Handling

**Goal**: Verify that existing blog posts with empty content render a user-friendly placeholder instead of breaking.

1. In the database or admin, identify a legacy blog post that previously relied on a Quiz slug (where `content` is `NULL`).
2. Navigate to `http://localhost:3000/blog/[legacy-slug]`.
3. **Expected Outcome**:
   - Header, title, authors, and summary render properly.
   - The article body displays the placeholder: `*Nội dung bài viết đang được cập nhật...*`.
   - No 404, 500, or 502 errors occur.

---

## 5. Validation Scenario 4: Edit and Add/Remove Authors

**Goal**: Verify editing existing content and updating author associations works seamlessly.

1. Navigate to `http://localhost:3000/admin/blogs/[id]/edit`.
2. Modify the Markdown body text and change author selections (e.g., remove one author, add a different author).
3. Click **Cập nhật bài viết** (Save).
4. Refresh public page `http://localhost:3000/blog/[slug]`.
5. **Expected Outcome**:
   - Updated content and author list reflect immediately (revalidation verified).
