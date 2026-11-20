# API & HTTP Contracts: DUT-AI SSO Integration

**Feature**: DUT-AI Ecosystem Single Sign-On (SSO) Integration  
**Date**: 2026-11-20  
**Status**: Ready  

---

## 1. External IdP Contract: Central User Profile Endpoint

- **Method**: `GET`
- **URL**: `https://manage.dutai.io.vn/api/v1/auth/me`
- **Authentication**:
  - Request Header: `Cookie: access_token=<JWT_TOKEN>` OR `Authorization: Bearer <JWT_TOKEN>`
  - Request Header: `Accept: application/json`

### 1.1 Success Response (200 OK)
```json
{
  "is_success": true,
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 12,
    "name": "Nguyễn Phước Huynh",
    "email": "huynhphuocnguyen.dev@gmail.com",
    "avatar_url": "https://minio.dutai.io.vn/dut-ai-manager-prod/avatars/user_12.png",
    "role_names": ["admin", "member"],
    "permissions": ["blogs:create", "blogs:update", "projects:manage", "members:verify"],
    "status": "ACTIVE",
    "is_deleted": false
  }
}
```

### 1.2 Unauthorized Response (401 Unauthorized)
Returned when the access token is invalid, expired, revoked, or missing.
```json
{
  "is_success": false,
  "status_code": 401,
  "message": "Token expired or invalid",
  "data": null
}
```

---

## 2. Internal Web API: Current User Profile

- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Description**: Proxy endpoint used by client-side components to retrieve the currently logged in user profile without exposing backend tokens.
- **Headers**: Automatically receives cookies from browser (`Cookie: access_token=...`).

### 2.1 Success Response (200 OK)
```json
{
  "is_success": true,
  "status_code": 200,
  "data": {
    "id": 12,
    "name": "Nguyễn Phước Huynh",
    "email": "huynhphuocnguyen.dev@gmail.com",
    "avatar_url": "https://minio.dutai.io.vn/dut-ai-manager-prod/avatars/user_12.png",
    "role_names": ["admin", "member"],
    "permissions": ["blogs:create", "blogs:update", "projects:manage", "members:verify"]
  },
  "message": "Lấy thông tin người dùng thành công"
}
```

### 2.2 Unauthenticated Response (401 Unauthorized)
```json
{
  "is_success": false,
  "status_code": 401,
  "message": "Chưa đăng nhập hoặc thiếu access_token",
  "data": null
}
```

---

## 3. Internal Web API: Single Sign-Out (Logout)

- **Method**: `POST`
- **URL**: `/api/auth/logout`
- **Description**: Invalidates authentication credentials across `.dutai.io.vn` by setting `Max-Age=0` on session cookies.

### 3.1 Response Headers
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: access_token=; Domain=.dutai.io.vn; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure
Set-Cookie: refresh_token=; Domain=.dutai.io.vn; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure
Set-Cookie: dut_admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax
Set-Cookie: dut_admin_user=; Path=/; Max-Age=0; SameSite=Lax
```

### 3.2 Response Body
```json
{
  "is_success": true,
  "message": "Đăng xuất thành công",
  "redirect_url": "https://workspace.dutai.io.vn/login"
}
```

---

## 4. Central Portal Redirection Contract

When unauthenticated users access protected paths:
- **Target URL**: `https://workspace.dutai.io.vn/login`
- **Query Parameter**: `redirect`
- **Encoding**: Standard URI component encoding.
- **Example**:
  - Requested URL: `https://web.dutai.io.vn/admin/blogs/create`
  - Redirect Destination: `https://workspace.dutai.io.vn/login?redirect=https%3A%2F%2Fweb.dutai.io.vn%2Fadmin%2Fblogs%2Fcreate`
