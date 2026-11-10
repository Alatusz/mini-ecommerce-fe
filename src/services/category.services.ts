import apiClient from "@/config/axios.config"

// ข้อมูลสำหรับส่งไป Create / Update (Request Body)
export interface CategoryPayload {
  name: string
  slug?: string
  image?: string | null
  status?: "active" | "archived" | "draft"
}

// ข้อมูลหมวดหมู่ตัวเต็มที่ได้รับกลับมาจาก Backend (Entity Model)
export interface CategoryItem {
  id: string
  name: string
  slug: string
  image?: string | null
  status: "active" | "archived" | "draft"
  productCount?: number
  createdAt?: string
  updatedAt?: string
}

// พารามิเตอร์สำหรับส่ง Filter, Search และ Pagination ไปยัง Backend
export interface CategoryFilterParams {
  status?: string | string[]
  search?: string
  page?: number
  limit?: number
}

// โครงสร้าง Response ที่ได้จาก GET /api/categories
export interface CategoryListResponse {
  success: boolean
  total: number
  page: number
  limit: number
  totalPages: number
  data: CategoryItem[]
}

// ดึงรายการหมวดหมู่พร้อม Pagination & Search
export const getCategories = async (
  params?: CategoryFilterParams
): Promise<CategoryListResponse> => {
  const response = await apiClient.get<CategoryListResponse>("/categories", {
    params,
  })
  return response.data
}

export const getCategoryById = async (id: string) => {
  const response = await apiClient.get(`/categories/${id}`)
  return response.data
}

export const createCategory = async (data: CategoryPayload) => {
  const response = await apiClient.post("/categories", data)

  return response.data
}

export const updateCategory = async (
  id: string,
  data: Partial<CategoryPayload>
) => {
  const response = await apiClient.put(`/categories/${id}`, data)

  return response.data
}

export const patchCategoryStatus = async (id: string, status: string) => {
  const response = await apiClient.patch(`/categories/${id}/status`, { status })

  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/categories/${id}`)

  return response.data
}
