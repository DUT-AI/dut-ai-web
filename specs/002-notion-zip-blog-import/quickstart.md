# Quickstart & Verification Guide: Notion ZIP Blog Post Import

**Feature**: `002-notion-zip-blog-import`  
**Target Date**: 2026-10-14  

---

## Prerequisites

1. **Local Development Server Running**:
   ```bash
   cd frontend
   npm run dev
   ```
2. **MinIO Storage Server Running & Configured**:
   - Environment variables set in `frontend/.env`:
     - `MINIO_ENDPOINT`
     - `MINIO_ACCESS_KEY`
     - `MINIO_SECRET_KEY`
     - `MINIO_BUCKET_NAME`
     - `MINIO_PUBLIC_URL`
3. **Sample Notion Archive**:
   - Path: `/Users/nguyenhuynh/Documents/projects/dut-ai-web/57da3f8a-e1fe-4f43-9d0e-63f9abb55d9b_ExportBlock-722b653a-bd16-4c90-a03f-c6ab043354dc.zip`

---

## Verification Scenarios

### Scenario 1: API Endpoint Direct Verification

Verify that the route handler parses the ZIP archive, uploads all 9 images to MinIO, and rewrites markdown URLs:

```bash
# Obtain admin session cookie or test directly via authenticated curl:
curl -X POST http://localhost:3000/api/admin/blogs/import-notion \
  -H "Cookie: admin_session=YOUR_ADMIN_SESSION_TOKEN" \
  -F "file=@/Users/nguyenhuynh/Documents/projects/dut-ai-web/57da3f8a-e1fe-4f43-9d0e-63f9abb55d9b_ExportBlock-722b653a-bd16-4c90-a03f-c6ab043354dc.zip"
```

**Expected Outcome**:
```json
{
  "success": true,
  "title": "Thiết kế hướng đối tượng",
  "slug": "thiet-ke-huong-doi-tuong",
  "isSlugDuplicate": false,
  "summary": "Trong lộ trình kiến thức, nếu OOP...",
  "imagesCount": 9,
  "warnings": []
}
```
And the returned `content` must contain `https://` MinIO links instead of `Thi%E1%BA%BFt%20k%E1%BA%BF.../image.png`.

---

### Scenario 2: Admin UI End-to-End Workflow

1. Navigate to `http://localhost:3000/admin/blogs/create`.
2. Click the button **"Nhập từ ZIP Notion"** in the top action area.
3. In the modal dialog, select or drag-and-drop the sample Notion ZIP file.
4. Verify the loading spinner and processing status:
   - "Đang giải nén và tải ảnh lên MinIO..."
5. Verify form pre-population:
   - **Tiêu đề**: Populated with "Thiết kế hướng đối tượng".
   - **Slug**: Populated with `thiet-ke-huong-doi-tuong`.
   - **Mô tả ngắn**: Populated with the first introductory paragraph.
   - **Ảnh bìa**: Left blank (allowing automatic OpenGraph generation).
   - **Nội dung (Markdown Editor)**: Contains the full body with images rendering in live preview.
6. Select at least 1 author from the Multi-Author selector.
7. Click **"Tạo bài viết"**.
8. Navigate to `/blog/thiet-ke-huong-doi-tuong`:
   - All 9 images render cleanly without 404 broken links.
   - Authors display on the article header.

---

### Scenario 3: Duplicate Slug Inline Warning

1. Repeat the import of the same ZIP file without modifying the slug.
2. Verify that `isSlugDuplicate` is detected:
   - The **Slug** input field is outlined in red.
   - An error label `"Slug đã tồn tại, vui lòng thay đổi"` appears below the input.
   - The form submit button is disabled or alerts the user until the slug is modified to e.g. `thiet-ke-huong-doi-tuong-nang-cao`.

---

### Scenario 4: Error Handling & Corrupted Archives

1. Attempt to upload a non-ZIP file (e.g., `.txt`, `.png`).
   - Expected: Client validation immediately rejects the file with `"Chỉ chấp nhận tệp định dạng .zip"`.
2. Attempt to upload a `.zip` file containing no `.md` files:
   - Expected: Toast/modal error: `"File ZIP không chứa tệp nội dung Markdown (.md) hợp lệ từ Notion."`
