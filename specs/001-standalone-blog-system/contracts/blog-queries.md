# Interface Contract: Blog Data Queries

**Module**: `frontend/lib/db/features/blogs/queries.ts`  
**Target Consumers**: Public Blog Pages (`/blog`, `/blog/[slug]`), Admin Pages (`/admin/blogs`, `/admin/blogs/[id]/edit`)  

---

## 1. Function: `getBlogBySlug`

Fetches a single blog post by its unique slug, including authors and keywords.

### Signature

```typescript
export async function getBlogBySlug(slug: string): Promise<BlogResponse | null>
```

### Response Shape

```typescript
{
  id: number
  title: string
  slug: string
  summary: string
  content: string | null        // Directly returned from DB
  views: number
  image_url?: string
  created_at: string
  updated_at: string
  authors: Array<{
    id: number
    name: string
    avatar_url?: string
  }>
  keywords: Array<{
    id: number
    keyword_name: string
    number_blog_contain: number
  }>
}
```

### Performance & Caching

- Indexed lookup using `ix_blogs_slug`.
- Resolves authors via `getManageUsersMap()`.
- Zero external HTTP calls (no requests to Quiz API).

---

## 2. Function: `getBlogById`

Fetches a single blog post by its primary key ID (primarily for admin edit page).

### Signature

```typescript
export async function getBlogById(id: number): Promise<BlogResponse | null>
```

---

## 3. Function: `getBlogsQuery`

Fetches paginated/filtered list of blog posts for the blog directory and admin management table.

### Signature

```typescript
export async function getBlogsQuery(params?: {
  title?: string
  keyword?: string
}): Promise<BlogResponse[]>
```

---

## 4. Function: `createBlogQuery`

Inserts a new blog post and links authors and keywords.

### Signature

```typescript
export async function createBlogQuery(data: {
  title: string
  slug: string
  summary?: string
  content?: string
  imageUrl?: string
  authorIds?: number[]
  keywordIds?: number[]
}): Promise<number>
```

---

## 5. Function: `updateBlogQuery`

Updates an existing blog post and re-syncs author and keyword relations.

### Signature

```typescript
export async function updateBlogQuery(
  id: number,
  data: {
    title: string
    slug: string
    summary?: string
    content?: string
    imageUrl?: string
    authorIds?: number[]
    keywordIds?: number[]
  }
): Promise<void>
```
