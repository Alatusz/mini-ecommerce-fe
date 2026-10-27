import { useState, useMemo } from "react"
import {
  initialCategories,
  type CategoryItem,
} from "./common/mockCategory"

export type { CategoryItem }

export function useCategory() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [searchQuery, setSearchQuery] = useState("")

  // Modal dialog states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    itemCount: 0,
    status: "Active" as "Active" | "Archived",
  })
  const [formError, setFormError] = useState("")

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
    )
  }, [categories, searchQuery])

  // Statistics
  const stats = useMemo(() => {
    const totalCategories = categories.length
    const totalItems = categories.reduce((acc, c) => acc + c.itemCount, 0)
    const activeCount = categories.filter((c) => c.status !== "Archived").length
    const topCategory = [...categories].sort((a, b) => b.itemCount - a.itemCount)[0]

    return {
      totalCategories,
      totalItems,
      activeCount,
      topCategoryName: topCategory ? topCategory.name : "-",
      topCategoryCount: topCategory ? topCategory.itemCount : 0,
    }
  }, [categories])

  // Dialog openers
  const openAddDialog = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      itemCount: 0,
      status: "Active",
    })
    setFormError("")
    setIsAddOpen(true)
  }

  const openEditDialog = (category: CategoryItem) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      itemCount: category.itemCount,
      status: category.status || "Active",
    })
    setFormError("")
  }

  const openDeleteDialog = (category: CategoryItem) => {
    setDeletingCategory(category)
  }

  // Handlers
  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      setFormError("Category name is required")
      return
    }

    const slug = formData.slug.trim()
      ? formData.slug.trim().toLowerCase().replace(/\s+/g, "-")
      : formData.name.trim().toLowerCase().replace(/\s+/g, "-")

    const newCategory: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: formData.name.trim(),
      slug,
      description: formData.description.trim() || "No description provided.",
      itemCount: Number(formData.itemCount) || 0,
      status: formData.status,
    }

    setCategories((prev) => [newCategory, ...prev])
    setIsAddOpen(false)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return
    if (!formData.name.trim()) {
      setFormError("Category name is required")
      return
    }

    const slug = formData.slug.trim()
      ? formData.slug.trim().toLowerCase().replace(/\s+/g, "-")
      : formData.name.trim().toLowerCase().replace(/\s+/g, "-")

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name.trim(),
              slug,
              description: formData.description.trim(),
              itemCount: Number(formData.itemCount) || 0,
              status: formData.status,
            }
          : c
      )
    )
    setEditingCategory(null)
  }

  const handleDeleteCategory = () => {
    if (!deletingCategory) return
    setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id))
    setDeletingCategory(null)
  }

  return {
    categories: filteredCategories,
    rawCategories: categories,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    stats,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingCategory,
    setEditingCategory,
    deletingCategory,
    setDeletingCategory,
    formData,
    setFormData,
    formError,
    // Actions
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  }
}
