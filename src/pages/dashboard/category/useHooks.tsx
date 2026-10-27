import { useState } from "react"
import {
  initialCategories,
  type CategoryItem,
} from "./common/mockCategory"

export type { CategoryItem }

export function useCategory() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog UI states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

  return {
    categories,
    setCategories,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingCategory,
    setEditingCategory,
    deletingCategory,
    setDeletingCategory,
  }
}
