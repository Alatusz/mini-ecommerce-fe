import apiClient from "@/config/axios.config"

export interface StorefrontCategoryItem {
  id: string
  name: string
  slug: string
  image: string | null
  productCount: number
}

export interface StorefrontProductItem {
  id: string
  name: string
  slug: string
  originalPrice: number | null
  sellPrice: number
  stock: number
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export interface StorefrontProductParams {
  search?: string
  category?: string | string[]
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  sort?: "newest" | "price-asc" | "price-desc" | "name"
  page?: number
  limit?: number
}

export interface StorefrontCategoriesResponse {
  success: boolean
  data: StorefrontCategoryItem[]
}

export interface StorefrontProductsResponse {
  success: boolean
  total: number
  page: number
  limit: number
  totalPages: number
  data: StorefrontProductItem[]
}

export const getStorefrontCategories = async (params?: {
  limit?: number
}): Promise<StorefrontCategoriesResponse> => {
  const response = await apiClient.get<StorefrontCategoriesResponse>(
    "/storefront/categories",
    { params }
  )
  return response.data
}

export const getStorefrontProducts = async (
  params?: StorefrontProductParams
): Promise<StorefrontProductsResponse> => {
  const response = await apiClient.get<StorefrontProductsResponse>(
    "/storefront/products",
    { params }
  )
  return response.data
}
