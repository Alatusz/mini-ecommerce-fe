import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { getCategoryOptions } from "@/services/category.services"

export function useCategoryOptions(limit: number = 100) {
  return useQuery({
    queryKey: [QUERY_KEYS.OPTIONS.CATEGORIES, { limit }],
    queryFn: () => getCategoryOptions({ limit }),
    staleTime: 1000 * 60 * 5,
  })
}