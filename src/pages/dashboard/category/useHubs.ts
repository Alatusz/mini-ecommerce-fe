import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { getCategoryOptions } from "@/services/category.services"

/**
 * Shared Hook สำหรับดึงตัวเลือก Categories (ใช้ร่วมกันทั้งหน้า List, Create, Edit)
 */
export function useCategoryOptions(limit: number = 100) {
  return useQuery({
    queryKey: [QUERY_KEYS.OPTIONS.CATEGORIES, { limit }],
    queryFn: () => getCategoryOptions({ limit }),
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Shared Helper สำหรับล้าง Cache รายการ Categories หลัง Create / Edit / Delete
 */
export function invalidateCategoryQueries() {
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
  })
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.OPTIONS.CATEGORIES],
  })
}
