import apiClient from "@/config/axios.config"

export interface IProduct {
  name: string
  slug?: string
  description?: string
  originalPrice?: number
  sellPrice: number
  stock: number
  images: string[]
  status: "draft" | "published" | "archived"
  categoryId: string
}

export interface ProductFilterParams {
  name?: string
  search?: string
}

// 1. ดึงรายการสินค้าทั้งหมด (รองรับ Query Params search/name)
export const getProducts = async (params?: ProductFilterParams) => {
  const response = await apiClient.get("/products", { params })
  
  return response.data
}

// 2. ดึงข้อมูลสินค้าตาม ID
export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`)

  return response.data
}

// 3. สร้างสินค้าใหม่ (POST)
export const createProduct = async (data: IProduct) => {
  const response = await apiClient.post("/products", data)

  return response.data
}

// 4. แก้ไขข้อมูลสินค้า (PUT)
export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const response = await apiClient.put(`/products/${id}`, data)

  return response.data
}

// 5. ลบสินค้า (DELETE)
export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`)
  
  return response.data
}
