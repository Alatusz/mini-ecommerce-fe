import { useState, useCallback } from "react"
import {
  getStoredCategories,
  deleteCategoryFromStore,
  type CategoryItem,
} from "./common/mockCategory"

export type { CategoryItem }

export function useCategory() {
  const [categories, setCategories] = useState<CategoryItem[]>(getStoredCategories)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

  const refreshCategories = useCallback(() => {
    setCategories(getStoredCategories())
  }, [])

  const handleDeleteCategory = (id: string) => {
    deleteCategoryFromStore(id)
    refreshCategories()
    setDeletingCategory(null)
  }

  return {
    categories,
    setCategories,
    refreshCategories,
    deletingCategory,
    setDeletingCategory,
    handleDeleteCategory,
  }
}
