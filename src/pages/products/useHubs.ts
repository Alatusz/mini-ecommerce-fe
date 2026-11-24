import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getStorefrontCategories,
  getStorefrontProducts,
  type StorefrontProductParams,
} from "@/services/storefront.services"

export function useProductsCatalogQuery(params: StorefrontProductParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.PRODUCTS, "catalog", params],
    queryFn: () => getStorefrontProducts(params),
    placeholderData: keepPreviousData,
  })
}

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.CATEGORIES, "catalog"],
    queryFn: () => getStorefrontCategories({ limit: 50 }),
    placeholderData: keepPreviousData,
  })
}
