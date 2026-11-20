# API Contracts: Member Portfolio Endpoints

**Feature**: `004-member-portfolios`
**Date**: 2026-11-20

## 1. Public Portfolio API

### `GET /api/members/:username`
Fetches complete public portfolio data for a given member username.

- **Authentication**: None (Public)
- **Parameters**: `username` (URL path parameter)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "user_id": 42,
    "username": "phuoc-nguyen",
    "name": "Nguyễn Huỳnh Phước",
    "avatar_url": "https://minio.dutai.site/dut-ai-manager-prod/avatars/user-42.png",
    "headline": "Fullstack AI Engineer & Core Member",
    "quote": "Programming is not just a job, it's a passion.",
    "bio": "Passionate developer focused on building AI-powered web applications...",
    "social_links": {
      "github": "https://github.com/phuocnguyen",
      "linkedin": "https://linkedin.com/in/phuocnguyen",
      "facebook": "https://facebook.com/phuocnguyen",
      "website": "https://phuocnguyen.dev"
    },
    "skills": [
      {
        "category": "Languages",
        "items": ["Python", "TypeScript", "SQL"]
      },
      {
        "category": "Frameworks & Libraries",
        "items": ["Next.js", "React", "FastAPI", "PyTorch"]
      },
      {
        "category": "DevOps & Tools",
        "items": ["Docker", "Git", "MinIO", "PostgreSQL"]
      }
    ],
    "projects": [
      {
        "id": 10,
        "title": "DUT AI Portal",
        "description": "Nền tảng website và quản trị câu lạc bộ DUT AI",
        "role": "Frontend Lead",
        "image_url": "https://minio.dutai.site/projects/portal.png",
        "demo_url": "https://dutai.io.vn",
        "repo_url": null,
        "technologies": "Next.js, Tailwind CSS, PostgreSQL",
        "is_club_project": true
      },
      {
        "id": 1,
        "title": "Chatify",
        "description": "Realtime AI workspace chat application",
        "role": null,
        "image_url": "https://minio.dutai.site/uploads/chatify.png",
        "demo_url": "https://chatify-demo.web.app",
        "repo_url": "https://github.com/phuocnguyen/chatify",
        "technologies": "React, Firebase, Tailwind CSS",
        "is_club_project": false
      }
    ],
    "cv": {
      "file_url": "https://minio.dutai.site/dut-ai-manager-prod/resumes/uuid-cv.pdf",
      "file_name": "Phuoc_Nguyen_CV.pdf",
      "file_size": 1420500,
      "updated_at": "2026-11-20T10:00:00Z"
    }
  }
}
```
- **Response `404 Not Found`**:
```json
{
  "success": false,
  "error": "Member portfolio not found"
}
```

---

## 2. Authenticated Member Management APIs

### `GET /api/members/me/portfolio`
Returns current member's editable portfolio state.

- **Authentication**: Required (Session cookie `dut_admin_session` / `access_token`)
- **Response `200 OK`**: Same schema as public API + editable fields and internal state.
- **Response `401 Unauthorized`**: `{ "success": false, "error": "Unauthorized" }`

---

### `PUT /api/members/me/portfolio`
Updates personal portfolio profile fields.

- **Authentication**: Required
- **Request Body (JSON)**:
```json
{
  "username": "phuoc-nguyen",
  "headline": "AI Engineer & Fullstack Developer",
  "quote": "Keep learning, keep building.",
  "bio": "Updated biography...",
  "avatar_url": "https://minio.dutai.site/...",
  "github_url": "https://github.com/phuocnguyen",
  "linkedin_url": "https://linkedin.com/in/phuocnguyen",
  "facebook_url": "https://facebook.com/...",
  "website_url": "https://...",
  "skills": [
    {
      "category": "Web Development",
      "items": ["Next.js", "React", "Tailwind CSS"]
    }
  ],
  "is_public": true
}
```
- **Validation**:
  - `username`: matches `/^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/`, not in reserved keyword list, unique across users.
  - URLs: valid URL format if provided.
- **Response `200 OK`**: `{ "success": true, "message": "Portfolio updated successfully" }`
- **Response `409 Conflict`**: `{ "success": false, "error": "Username is already taken" }`

---

### `POST /api/members/me/cv`
Uploads or replaces the member's PDF curriculum vitae.

- **Authentication**: Required
- **Request Format**: `multipart/form-data`
  - Field `file`: File binary (MIME `application/pdf`, max 10MB)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "cv_file_url": "https://minio.dutai.site/dut-ai-manager-prod/resumes/...",
    "cv_file_name": "Phuoc_Nguyen_Resume.pdf",
    "cv_file_size": 1548200
  }
}
```
- **Response `400 Bad Request`**: `{ "success": false, "error": "Only PDF files under 10MB are allowed" }`

---

### `DELETE /api/members/me/cv`
Removes the currently uploaded resume.

- **Authentication**: Required
- **Response `200 OK`**: `{ "success": true, "message": "CV removed" }`

---

### `POST /api/members/me/projects`
Creates a custom personal project entry.

- **Authentication**: Required
- **Request Body (JSON)**:
```json
{
  "title": "My Awesome Project",
  "description": "Detailed description of the project",
  "image_url": "https://...",
  "demo_url": "https://...",
  "repo_url": "https://github.com/...",
  "technologies": "TypeScript, PyTorch, Next.js",
  "display_order": 0
}
```
- **Response `201 Created`**: Returns created project object with its generated `id`.

---

### `PUT /api/members/me/projects/:id`
Updates an existing personal project (verifying ownership by `user_id`).

---

### `DELETE /api/members/me/projects/:id`
Deletes a personal project.
