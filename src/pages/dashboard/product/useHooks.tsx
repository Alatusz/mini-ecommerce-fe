import { useMemo, useState } from "react"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getProducts,
  deleteProduct,
  type ProductItem,
  type ProductStats,
} from "@/services/product.services"
import { productCategories } from "./common/mockProduct"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { useSearchParams } from "react-router-dom"
import { getCategories, getCategoryOptions } from "@/services/category.services"
import {
  type AdvancedFilterState,
} from "./common/ProductFilterDrawer"

export type { ProductItem }
export { productCategories }

/**
 * Hook สำหรับดึงตัวเลือก Categories สำหรับ Dropdown / Filter ในโมดูล Product
 * รองรับการส่ง limit เพื่อปรับขนาดข้อมูล และมีแคช 5 นาทีตามมาตรฐาน
 */
export function useCategoryOptions(limit: number = 100) {
  return useQuery({
    queryKey: [QUERY_KEYS.OPTIONS.CATEGORIES, { limit }],
    queryFn: () => getCategoryOptions({ limit }),
    staleTime: 1000 * 60 * 5,
  })
}

const defaultStats: ProductStats = {
  totalSKUs: 0,
  totalUnits: 0,
  inStockCount: 0,
  lowStockCount: 0,
  outOfStockCount: 0,
}

export function useProduct() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(
    null
  )

  // ── 1. ดึง Query Params จาก URL (Single Source of Truth) ──
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10)
  const search = searchParams.get("search") || ""
  const rawSearchBy = searchParams.get("searchBy") || ""
  const rawStatus = searchParams.get("status") || ""
  const rawStockStatus = searchParams.get("stockStatus") || ""
  const rawCategory = searchParams.get("category") || ""

  const selectedSearchBy = useMemo(() => {
    return rawSearchBy
      ? rawSearchBy
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : []
  }, [rawSearchBy])

  // แปลง status จาก URL comma string เป็น string[] (รองรับ Multi-Select)
  const selectedStatuses = useMemo(() => {
    return rawStatus
      ? rawStatus
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : []
  }, [rawStatus])

  // แปลง stockStatus จาก URL comma string เป็น string[] (รองรับ Multi-Select)
  const selectedStockStatuses = useMemo(() => {
    return rawStockStatus
      ? rawStockStatus
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : []
  }, [rawStockStatus])

  // แปลง category จาก URL comma string เป็น string[] (รองรับ Multi-Select)
  const selectedCategories = useMemo(() => {
    return rawCategory
      ? rawCategory
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : []
  }, [rawCategory])

  // Query Data
  const {
    data: { products = [], stats = defaultStats, total = 0 } = {},
    isLoading,
    isError,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD.PRODUCTS_LIST,
      {
        page,
        limit,
        search,
        searchBy: rawSearchBy,
        status: rawStatus,
        stockStatus: rawStockStatus,
        category: rawCategory,
      },
    ],
    queryFn: () =>
      getProducts({
        page,
        limit,
        search,
        searchBy: rawSearchBy || undefined,
        status: rawStatus || undefined,
        stockStatus: rawStockStatus || undefined,
        category: rawCategory || undefined,
      }),
    placeholderData: keepPreviousData,
    select: (res) => ({
      products: res.data,
      stats: res.stats,
      total: res.total,
    }),
  })

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
    queryFn: () => getCategories(),
  })

  // Mutation สำหรับลบสินค้า
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      showToast.success("Product deleted successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.PRODUCTS_LIST],
      })

      setDeletingProduct(null)
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to delete product"

      showToast.error(message)
    },
  })

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id)
  }

  // URL Update Handlers
  const updateUrlParams = (
    newParams: Record<string, string | number | undefined>
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)

        Object.entries(newParams).forEach(([key, val]) => {
          if (val === undefined || val === "" || val === null) {
            next.delete(key)
          } else {
            next.set(key, String(val))
          }
        })

        return next
      },

      { replace: true }
    )
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
  }

  const handleLimitChange = (newLimit: number) => {
    updateUrlParams({ limit: newLimit, page: 1 })
  }

  const handleSearchChange = (newSearch: string) => {
    updateUrlParams({ search: newSearch, page: 1 })
  }

  const handleStatusFilterChange = (newStatuses: string[]) => {
    updateUrlParams({
      status: newStatuses.length > 0 ? newStatuses.join(",") : undefined,
      page: 1,
    })
  }

  const handleStockStatusFilterChange = (newStockStatuses: string[]) => {
    updateUrlParams({
      stockStatus:
        newStockStatuses.length > 0 ? newStockStatuses.join(",") : undefined,
      page: 1,
    })
  }

  const handleCategoryFilterChange = (newCategories: string[]) => {
    updateUrlParams({
      category: newCategories.length > 0 ? newCategories.join(",") : undefined,
      page: 1,
    })
  }

  // ── 5. Advanced Filter Handlers
  const handleApplyAdvancedFilters = ({
    searchBy: newSearchBy,
    status: newStatuses,
    stockStatus: newStockStatuses,
    category: newCategories,
  }: AdvancedFilterState) => {
    updateUrlParams({
      searchBy: newSearchBy.length === 1 ? newSearchBy[0] : undefined,
      status:
        newStatuses && newStatuses.length > 0
          ? newStatuses.join(",")
          : undefined,
      stockStatus:
        newStockStatuses && newStockStatuses.length > 0
          ? newStockStatuses.join(",")
          : undefined,
      category:
        newCategories && newCategories.length > 0
          ? newCategories.join(",")
          : undefined,
      page: 1,
    })
  }

  const handleResetFilters = () => {
    updateUrlParams({
      search: undefined,
      searchBy: undefined,
      status: undefined,
      stockStatus: undefined,
      category: undefined,
      page: 1,
    })
  }

  return {
    products,
    categories,
    total,
    inStockCount: stats.inStockCount,
    lowStockCount: stats.lowStockCount,
    outOfStockCount: stats.outOfStockCount,
    totalUnits: stats.totalUnits,
    page,
    limit,
    search,
    selectedSearchBy,
    selectedStatuses,
    selectedStockStatuses,
    selectedCategories,
    handleStatusFilterChange,
    handleStockStatusFilterChange,
    handleCategoryFilterChange,
    handleApplyAdvancedFilters,
    handleResetFilters,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    isLoading,
    isError,
    isPlaceholderData,
    deletingProduct,
    setDeletingProduct,
    handleDeleteProduct,
    isDeleting: deleteProductMutation.isPending,
  }
}
