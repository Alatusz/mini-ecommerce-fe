import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addCategoryToStore, type CategoryItem } from "../common/mockCategory"

export interface CategoryFormState {
  name: string
  slug: string
  image: string
  status: "Active" | "Archived"
}

export function useCategoryCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CategoryFormState>({
    name: "",
    slug: "",
    image: "",
    status: "Active",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    setFormData((prev) => {
      const prevAuto = prev.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      const shouldSyncSlug = !prev.slug || prev.slug === prevAuto

      return {
        ...prev,
        name,
        slug: shouldSyncSlug ? autoSlug : prev.slug,
      }
    })

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }))
    }
  }

  const handleFieldChange = <K extends keyof CategoryFormState>(
    field: K,
    value: CategoryFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormState, string>> = {}

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
    if (!validate()) return

    setIsSubmitting(true)

    const newCategory: CategoryItem = {
      id: `category-${Date.now().toString(36)}`,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      image: formData.image.trim() || "/images/showcase-gadgets.png",
      itemCount: 0,
      status: formData.status,
    }

    addCategoryToStore(newCategory)

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/category")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/category")
  }

  return {
    formData,
    errors,
    isSubmitting,
    handleNameChange,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  }
}
