# Interface Contract: Admin Blog Server Actions

**Module**: `frontend/app/admin/blogs/actions.ts`  
**Target Consumers**: Admin Blog Forms (`BlogForm.tsx`, delete buttons)  

---

## 1. Action: `saveBlogAction`

Handles both creating a new blog post and updating an existing blog post.

### Signature

```typescript
export async function saveBlogAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string }>
```

### Form Data Payload

| Key | Type | Required | Description |
|---|---|---|---|
| `id` | `string` (parsed to int) | Optional | If present, updates blog `id`; otherwise creates a new blog |
| `title` | `string` | **Yes** | Article headline (non-empty after trim) |
| `slug` | `string` | **Yes** | URL-friendly slug (validated unique) |
| `summary` | `string` | Optional | Short abstract |
| `content` | `string` | Optional | Article Markdown content body |
| `imageUrl` | `string` | Optional | MinIO image URL |
| `authorIds` | `string[]` | Optional | One or more user IDs associated as authors |
| `keywordIds`| `string[]` | Optional | One or more keyword IDs associated with the post |

### Behaviors & Validations

1. **Authentication Check**: Verifies active admin session via `getAdminSession()`. Returns `{ error: 'Bạn không có quyền thực hiện hành động này.' }` if unauthorized.
2. **Title Validation**: Fails if `title` is missing/empty.
3. **Slug Validation**:
   - Slug cannot be empty.
   - Slug cannot contain invalid URL characters (must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` or sanitized via `slugger`).
   - Must be unique among all blogs (excluding current `id` when editing).
4. **Author Assignment**:
   - Supports 0, 1, or multiple authors.
   - Authors must exist in `users`.
5. **Cache Revalidation**:
   - Calls `revalidateTag('blogs', 'max')`.
   - Calls `revalidatePath('/blog')`.
   - Calls `revalidatePath(`/blog/${slug}`)`.
6. **Redirect**:
   - On successful save, performs `redirect('/admin/blogs')`.

---

## 2. Action: `deleteBlogAction`

Deletes an existing blog post and its associated junction records.

### Signature

```typescript
export async function deleteBlogAction(
  id: number
): Promise<{ success: boolean; error?: string }>
```

### Behaviors

1. Verifies admin session.
2. Calls `deleteBlogQuery(id)`.
3. Revalidates blog cache tags.
4. Returns `{ success: true }`.
