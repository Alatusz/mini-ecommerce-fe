import { useState, useMemo } from "react"
import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getCategories,
  deleteCategory,
  patchCategoryStatus,
  type CategoryItem,
} from "@/services/category.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { useSearchParams } from "react-router-dom"

export type { CategoryItem }

export function useCategory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

  // ── 1. ดึง Query Params จาก URL (Single Source of Truth) ──
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10)
  const search = searchParams.get("search") || ""
  const rawStatus = searchParams.get("status") || ""

  // แปลงค่า status จาก URL comma string เช่น "active,draft" เป็น string[]
  const selectedStatuses = useMemo(() => {
    return rawStatus
      ? rawStatus.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      : []
  }, [rawStatus])

  // ── 2. ดึงข้อมูลผ่าน React Query (ยิง API ใหม่อัตโนมัติเมื่อ params เปลี่ยน) ──
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD.CATEGORIES_LIST,
      { page, limit, search, status: rawStatus },
    ],
    queryFn: () => getCategories({ page, limit, search, status: rawStatus || undefined }),
    placeholderData: keepPreviousData, // คงข้อมูลหน้าเดิมไว้ระหว่างรอโหลด เพื่อไม่ให้หน้าจอกระพริบ
  })

  const categories: CategoryItem[] = Array.isArray(data)
    ? data
    : (data?.data ?? [])

  const total: number = Array.isArray(data)
    ? data.length
    : (data?.total ?? categories.length)

  // ── 3. คำนวณค่าสถิติสำหรับ KPI Cards ──
  const activeCount = categories.filter((c) => c.status === "active").length
  const draftCount = categories.filter((c) => c.status === "draft").length
  const archivedCount = categories.filter((c) => c.status === "archived").length
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productCount ?? 0),
    0
  )
  const emptyCount = categories.filter(
    (c) => (c.productCount ?? 0) === 0
  ).length
  const avgProducts = total > 0 ? (totalProducts / total).toFixed(1) : "—"

  // ── 4. Mutations (ลบและอัปเดตสถานะ) ──
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      showToast.success("Category deleted successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
      })
      setDeletingCategory(null)
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to delete category"
      showToast.error(message)
    },
  })

  const patchStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patchCategoryStatus(id, status),
    onSuccess: (_, variables) => {
      showToast.success(`Category status updated to ${variables.status}`)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
      })
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to update category status"
      showToast.error(message)
    },
  })

  // ── 5. Action Handlers ──
  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    patchStatusMutation.mutate({ id, status: newStatus })
  }

  // ฟังก์ชันช่วยอัปเดต URL Search Params
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
    updateUrlParams({ limit: newLimit, page: 1 }) // เปลี่ยน limit ให้รีเซ็ตกลับหน้า 1
  }

  const handleSearchChange = (newSearch: string) => {
    updateUrlParams({ search: newSearch, page: 1 }) // ค้นหาใหม่ ให้รีเซ็ตกลับหน้า 1
  }

  const handleStatusFilterChange = (newStatuses: string[]) => {
    updateUrlParams({
      status: newStatuses.length > 0 ? newStatuses.join(",") : undefined,
      page: 1, // กรองสถานะใหม่ ให้รีเซ็ตกลับหน้า 1
    })
  }

  return {
    categories,
    total,
    status: rawStatus,
    selectedStatuses,
    page,
    limit,
    search,
    isLoading,
    isPlaceholderData,
    activeCount,
    draftCount,
    archivedCount,
    totalProducts,
    emptyCount,
    avgProducts,
    deletingCategory,
    setDeletingCategory,
    handleDeleteCategory,
    isDeleting: deleteCategoryMutation.isPending,
    handleStatusChange,
    isUpdatingStatus: patchStatusMutation.isPending,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    handleStatusFilterChange,
  }
}
