import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getCategoryById,
  updateCategoryInStore,
  deleteCategoryFromStore,
  type CategoryItem,
} from "../common/mockCategory"

export interface CategoryEditFormState {
  name: string
  slug: string
  image: string
  status: "Active" | "Archived"
}

export function useCategoryEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [category, setCategory] = useState<CategoryItem | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [formData, setFormData] = useState<CategoryEditFormState>({
    name: "",
    slug: "",
    image: "",
    status: "Active",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryEditFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsNotFound(true)
      return
    }

    const found = getCategoryById(id)
    if (!found) {
      setIsNotFound(true)
      return
    }

    setCategory(found)
    setFormData({
      name: found.name,
      slug: found.slug,
      image: found.image || "",
      status: found.status || "Active",
    })
    setIsNotFound(false)
  }, [id])

  const handleFieldChange = <K extends keyof CategoryEditFormState>(
    field: K,
    value: CategoryEditFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryEditFormState, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL slug identifier is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      newErrors.slug = "Slug must contain only lowercase alphanumeric characters and hyphens"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!id || !validate()) return

    setIsSubmitting(true)

    updateCategoryInStore(id, {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      image: formData.image.trim(),
      status: formData.status,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/category")
    }, 250)
  }

  const handleDelete = () => {
    if (!id) return
    setIsDeleting(true)
    deleteCategoryFromStore(id)
    setTimeout(() => {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      navigate("/dashboard/category")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/category")
  }

  return {
    id,
    category,
    isNotFound,
    formData,
    errors,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
