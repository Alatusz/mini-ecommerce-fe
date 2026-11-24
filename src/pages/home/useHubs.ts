import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getStorefrontCategories,
  getStorefrontProducts,
  type StorefrontProductItem,
  type StorefrontProductParams,
} from "@/services/storefront.services"
import type { ProductCardData } from "@/components/shares/ProductCard"

export function useStorefrontCategoriesQuery(limit = 10) {
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.CATEGORIES, { limit }],
    queryFn: () => getStorefrontCategories({ limit }),
    placeholderData: keepPreviousData,
  })
}

export function useStorefrontProductsQuery(params?: StorefrontProductParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.PRODUCTS, params],
    queryFn: () =>
      getStorefrontProducts({
        limit: 12,
        ...params,
      }),
    placeholderData: keepPreviousData,
  })
}

export function mapProductToCard(item: StorefrontProductItem): ProductCardData {
  return {
    id: item.id,
    name: item.name,
    price: Number(item.sellPrice ?? 0),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    image: item.image || "/alatusz-logo.svg",
    rating: 0,
    reviewCount: 0,
    category: item.category?.name,
    stock: item.stock,
  }
}
