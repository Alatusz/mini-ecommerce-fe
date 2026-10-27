import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  addProductToStore,
  productCategories,
  type ProductItem,
} from "../common/mockProduct"

export interface ProductFormState {
  name: string
  sku: string
  category: string
  price: string
  stock: string
  image: string
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export function useProductCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<ProductFormState>({
    name: "",
    sku: "",
    category: productCategories.find((c) => c !== "All") || "Smartphones",
    price: "",
    stock: "50",
    image: "",
    status: "In Stock",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNameChange = (name: string) => {
    // Generate suggested SKU from name words (e.g. Sony WH 1000 -> SONY-WH-1000)
    const suggestedSku = name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .slice(0, 3)
      .join("-")

    setFormData((prev) => {
      const prevAuto = prev.name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "")
        .split(/\s+/)
        .slice(0, 3)
        .join("-")

      const shouldSyncSku = !prev.sku || prev.sku === prevAuto

      return {
        ...prev,
        name,
        sku: shouldSyncSku && suggestedSku ? suggestedSku : prev.sku,
      }
    })

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }))
    }
  }

  const handleFieldChange = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }

      // Auto update status based on stock if stock changed
      if (field === "stock") {
        const units = Number(value)
        if (units <= 0) {
          next.status = "Out of Stock"
        } else if (units < 10) {
          next.status = "Low Stock"
        } else {
          next.status = "In Stock"
        }
      }

      return next
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormState, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product title is required"
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU identifier code is required"
    }

    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Valid price is required"
    }

    if (!formData.stock.trim() || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Valid stock count is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    const newProduct: ProductItem = {
      id: `prod-${Date.now().toString(36)}`,
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      salesCount: 0,
      image: formData.image.trim() || "/images/detail-purple.png",
      status: formData.status,
    }

    addProductToStore(newProduct)

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/product")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/product")
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
