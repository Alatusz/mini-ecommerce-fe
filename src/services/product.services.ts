import apiClient from "@/config/axios.config"

export type ProductPublishStatus = "draft" | "published" | "archived"
export type ProductStockStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface IProduct {
  name: string
  slug?: string
  description?: string
  originalPrice?: number
  sellPrice: number
  stock: number
  images: string[]
  status: ProductPublishStatus
  categoryId: string
}

export interface ProductCategoryItem {
  id: string
  name: string
  slug: string
}

// ข้อมูลสินค้าตัวเต็มที่ส่งมาจาก Database (Response Entity)
export interface ProductItem {
  id: string
  name: string
  sku: string
  description?: string | null
  originalPrice?: number | null
  sellPrice: number | null
  stock: number
  stockStatus: ProductStockStatus
  status: ProductPublishStatus
  images: string[]
  categories: ProductCategoryItem[]
  createdAt: string
  updatedAt: string
}

// ตัวเลขสถิติ KPI ที่คำนวณสำเร็จรูปมาจาก Database
export interface ProductStats {
  totalSKUs: number
  totalUnits: number
  inStockCount: number
  lowStockCount: number
  outOfStockCount: number
}

export interface ProductFilterParams {
  name?: string
  search?: string
  searchBy?: "all" | "name" | "sku" | string
  page?: number
  limit?: number
  category?: string | string[]
  categoryId?: string | string[]
  status?: ProductPublishStatus | ProductPublishStatus[] | string
  stockStatus?: ProductStockStatus | ProductStockStatus[] | string
}

export interface ProductListResponse {
  success: boolean
  total: number
  page: number
  limit: number
  totalPages: number
  stats: ProductStats
  data: ProductItem[]
}

// 1. ดึงรายการสินค้าทั้งหมด (รองรับ Query Params search/name พร้อมสถิติและ Pagination)
export const getProducts = async (
  params?: ProductFilterParams
): Promise<ProductListResponse> => {
  const response = await apiClient.get<ProductListResponse>("/products", {
    params,
  })
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
