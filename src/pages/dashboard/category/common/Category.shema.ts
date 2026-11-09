import { z } from "zod"

export const categoryStatusSchema = z.enum(["active", "archived", "draft"], {
  message: "กรุณาเลือกสถานะหมวดหมู่ที่ถูกต้อง",
})

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อหมวดหมู่")
    .max(100, "ชื่อหมวดหมู่ต้องมีความยาวไม่เกิน 100 ตัวอักษร"),

  slug: z
    .string()
    .trim()
    .min(1, "กรุณากรอก URL slug")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug ต้องประกอบด้วยตัวพิมพ์เล็ก ตัวเลข และเครื่องหมายขีด (-) เท่านั้น"
    ),

  image: z.string().trim().optional().or(z.literal("")),

  status: categoryStatusSchema.default("active"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const categoryCreateSchema = categorySchema.omit({ slug: true })

export type CategoryCreateFormValues = z.infer<typeof categoryCreateSchema>

export const categoryEditSchema = categorySchema.omit({ slug: true })

export type CategoryEditFormValues = z.infer<typeof categoryEditSchema>
