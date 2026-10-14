import { z } from 'zod'

export const blogFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề bài viết không được để trống.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Đường dẫn (slug) không được để trống.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug chỉ gồm chữ thường, số và dấu gạch ngang (ví dụ: bai-viet-so-1)'
    ),
  summary: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  image: z.custom<File | null>().optional().nullable(),
  authorIds: z.array(z.number()),
  keywordIds: z.array(z.number()),
})

export type BlogFormValues = z.infer<typeof blogFormSchema>
