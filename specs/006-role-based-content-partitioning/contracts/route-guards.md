# Interface Contract: Route Guarding & Navigation Adaptation

**Module**: `frontend/middleware.ts` & `frontend/app/admin/layout.tsx`  
**Feature**: `006-role-based-content-partitioning`  
**Date**: 2026-11-21  

---

## 1. Middleware Redirection Contract

### 1.1 Content Zone Interception

When an incoming HTTP request matches a Content Management route:

```text
Target Routes:
- /admin
- /admin/blogs/*
- /admin/projects/*
- /admin/events/*
- /admin/posts/*
- /admin/generations/*
- /admin/keywords/*
- /admin/introductions/*
```

**Guard Condition**:
```typescript
const isContentRoute =
  pathname === '/admin' ||
  pathname.startsWith('/admin/blogs') ||
  pathname.startsWith('/admin/projects') ||
  pathname.startsWith('/admin/events') ||
  pathname.startsWith('/admin/posts') ||
  pathname.startsWith('/admin/generations') ||
  pathname.startsWith('/admin/keywords') ||
  pathname.startsWith('/admin/introductions')

if (isContentRoute) {
  const payload = decodeJwtPayload(token)
  const isAuthorized = hasContentAccess(payload?.role_names || payload?.roles)
  
  if (!isAuthorized) {
    const redirectUrl = new URL('/admin/portfolio', request.url)
    redirectUrl.searchParams.set('denied', 'content')
    return NextResponse.redirect(redirectUrl)
  }
}
```

---

## 2. Admin Layout Navigation Contract

### 2.1 Sidebar Structure

The administrative sidebar renders two distinct navigation sections:

```typescript
export const ADMIN_NAV_SECTIONS: NavSectionConfig[] = [
  {
    title: 'QUẢN LÝ NỘI DUNG',
    partition: 'CONTENT_MANAGEMENT',
    items: [
      { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/blogs', label: 'Bài viết (Blogs)', icon: FileText, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/projects', label: 'Dự án (Projects)', icon: Briefcase, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/events', label: 'Sự kiện (Events)', icon: Calendar, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/posts', label: 'Khoảnh khắc (Moments)', icon: ImageIcon, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/generations', label: 'Album thế hệ', icon: Users, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/keywords', label: 'Từ khóa (SEO)', icon: Tag, partition: 'CONTENT_MANAGEMENT' },
      { href: '/admin/introductions', label: 'Giới thiệu (Intro)', icon: Info, partition: 'CONTENT_MANAGEMENT' },
    ],
  },
  {
    title: 'THÔNG TIN THÀNH VIÊN',
    partition: 'MEMBER_INFO',
    items: [
      { href: '/admin/portfolio', label: 'Hồ sơ cá nhân (Portfolio)', icon: UserCircle, partition: 'MEMBER_INFO' },
    ],
  },
]
```

**Rendering Rule**:
- If `isContentManager === true`: Render both `QUẢN LÝ NỘI DUNG` and `THÔNG TIN THÀNH VIÊN` sections.
- If `isContentManager === false`: Render ONLY `THÔNG TIN THÀNH VIÊN` section.

---

## 3. Header User Menu Dropdown Contract (`UserMenuDropdown.tsx`)

```typescript
// If user has Content access (or admin):
<Link href="/admin">
  <LayoutDashboard />
  <span>Bảng quản trị (Admin)</span>
</Link>
<Link href="/admin/portfolio">
  <UserCircle />
  <span>Hồ sơ cá nhân</span>
</Link>

// If user is a general member (non-Content):
<Link href="/admin/portfolio">
  <UserCircle />
  <span>Hồ sơ cá nhân</span>
</Link>
// "Bảng quản trị (Admin)" link is completely hidden
```
