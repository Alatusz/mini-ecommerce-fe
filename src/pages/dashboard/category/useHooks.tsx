import { useState } from "react"
import { type CategoryItem } from "./common/mockCategory"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getCategories,
  deleteCategory,
  patchCategoryStatus,
} from "@/services/category.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export type { CategoryItem }

export function useCategory() {
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(
    null
  )

  // GET DATA
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
    queryFn: () => getCategories(),
  })

  const categories: CategoryItem[] = Array.isArray(data)
    ? data
    : (data?.data ?? [])

  const total: number = Array.isArray(data)
    ? data.length
    : (data?.total ?? categories.length)

  // MUTATION - DELETE
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

  // MUTATION - PATCH STATUS
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

  // Handle Delete
  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id)
  }

  // Handle Status Change
  const handleStatusChange = (id: string, newStatus: string) => {
    patchStatusMutation.mutate({ id, status: newStatus })
  }

  return {
    categories,
    total,
    isLoading,
    isError,
    error,
    deletingCategory,
    setDeletingCategory,
    handleDeleteCategory,
    isDeleting: deleteCategoryMutation.isPending,
    handleStatusChange,
    handleToggleStatus: handleStatusChange,
    isUpdatingStatus: patchStatusMutation.isPending,
  }
}
