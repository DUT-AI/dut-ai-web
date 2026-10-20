# API Contract: Notion ZIP Blog Import

**Endpoint**: `POST /api/admin/blogs/import-notion`  
**Authentication**: Admin Session Required (`getAdminSession()`)  
**Content-Type**: `multipart/form-data`  

---

## Request

### Headers
- `Cookie`: Admin session cookie (required for authentication)

### Body Parameters (`FormData`)

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `file` | `File` | Yes | MIME: `application/zip`, `application/x-zip-compressed`; Max size: 50 MB | The exported Notion ZIP archive containing a `.md` file and optional image assets. |

---

## Responses

### 1. `200 OK` - Success

Returned when the ZIP archive is successfully unpacked, images uploaded to MinIO, and markdown paths rewritten.

```json
{
  "success": true,
  "title": "Thiết kế hướng đối tượng",
  "slug": "thiet-ke-huong-doi-tuong",
  "isSlugDuplicate": false,
  "summary": "Trong lộ trình kiến thức, nếu OOP cung cấp cho bạn vũ khí và cú pháp, thì OOD là chiến lược tác chiến...",
  "content": "# Thiết kế hướng đối tượng\n\n# Tổng quan\n\n![image.png](https://minio.dutai.site/dut-ai-manager-prod/blogs/3f798e2c-image.png)\n\nTrong lộ trình kiến thức...",
  "imagesCount": 9,
  "warnings": []
}
```

If the generated slug already exists in the database, `isSlugDuplicate` will be `true`:

```json
{
  "success": true,
  "title": "Thiết kế hướng đối tượng",
  "slug": "thiet-ke-huong-doi-tuong",
  "isSlugDuplicate": true,
  "summary": "...",
  "content": "...",
  "imagesCount": 9,
  "warnings": [
    "Slug \"thiet-ke-huong-doi-tuong\" đã tồn tại. Vui lòng chỉnh sửa slug trước khi lưu."
  ]
}
```

---

### 2. `400 Bad Request` - Missing or Invalid File

```json
{
  "error": "Vui lòng chọn tệp ZIP xuất từ Notion."
}
```

---

### 3. `401 Unauthorized` - Authentication Failure

```json
{
  "error": "Unauthorized"
}
```

---

### 4. `413 Payload Too Large` - File Exceeds 50MB Limit

```json
{
  "error": "Dung lượng tệp ZIP vượt quá giới hạn cho phép (tối đa 50 MB)."
}
```

---

### 5. `422 Unprocessable Entity` - Missing Markdown Content

```json
{
  "error": "File ZIP không chứa tệp nội dung Markdown (.md) hợp lệ từ Notion."
}
```

---

### 6. `500 Internal Server Error` - Extraction or Storage Failure

```json
{
  "error": "Không thể xử lý tệp ZIP hoặc tải ảnh lên bộ lưu trữ MinIO: [chi tiết lỗi]"
}
```
