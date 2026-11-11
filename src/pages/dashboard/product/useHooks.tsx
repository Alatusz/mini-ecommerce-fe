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
import { getCategories } from "@/services/category.services"

export type { ProductItem }
export { productCategories }

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
  const searchBy =
    (searchParams.get("searchBy") as "all" | "name" | "sku") || "all"
  const rawStatus = searchParams.get("status") || ""
  const rawStockStatus = searchParams.get("stockStatus") || ""
  const rawCategory = searchParams.get("category") || ""

  // แปลง status จาก URL comma string เป็น string[] (รองรับ Multi-Select สำหรับ Lifecycle)
  const selectedStatuses = useMemo(() => {
    return rawStatus
      ? rawStatus
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : []
  }, [rawStatus])

  // แปลง stockStatus จาก URL comma string เป็น string[] (รองรับ Multi-Select สำหรับ Stock)
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

  // ── 2. ดึงข้อมูลสินค้าและสถิติพร้อมกันจาก Backend ──
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
        searchBy,
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
        searchBy: searchBy !== "all" ? searchBy : undefined,
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

  // ── 3. Mutation สำหรับลบสินค้า ──
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

  // ── 4. URL Update Handlers ──
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

  // ── 5. Advanced Filter Handlers (Applied from Popover) ──
  const handleApplyAdvancedFilters = ({
    searchBy: newSearchBy,
    status: newStatuses,
    stockStatus: newStockStatuses,
  }: {
    searchBy?: "all" | "name" | "sku"
    status?: string[]
    stockStatus?: string[]
  }) => {
    updateUrlParams({
      searchBy: newSearchBy && newSearchBy !== "all" ? newSearchBy : undefined,
      status:
        newStatuses && newStatuses.length > 0
          ? newStatuses.join(",")
          : undefined,
      stockStatus:
        newStockStatuses && newStockStatuses.length > 0
          ? newStockStatuses.join(",")
          : undefined,
      page: 1,
    })
  }

  const handleResetFilters = () => {
    updateUrlParams({
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
    searchBy,
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
