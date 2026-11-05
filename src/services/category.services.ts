import apiClient from "@/config/axios.config"

export interface CategoryPayload {
  name: string
  slug?: string
  image?: string | null
  status?: "active" | "archived" | "draft"
}

export interface CategoryFilterParams {
  status?: string
  search?: string
}

export const getCategories = async (params?: CategoryFilterParams) => {
  const response = await apiClient.get("/categories", { params })
  
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

export const updateCategory = async (id: string, data: Partial<CategoryPayload>) => {
  const response = await apiClient.put(`/categories/${id}`, data)

  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/categories/${id}`)
  
  return response.data
}
