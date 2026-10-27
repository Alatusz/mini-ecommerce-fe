import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getProductById,
  updateProductInStore,
  deleteProductFromStore,
  type ProductItem,
} from "../common/mockProduct"

export interface ProductEditFormState {
  name: string
  sku: string
  category: string
  price: string
  stock: string
  image: string
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export function useProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductItem | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [formData, setFormData] = useState<ProductEditFormState>({
    name: "",
    sku: "",
    category: "Smartphones",
    price: "",
    stock: "",
    image: "",
    status: "In Stock",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProductEditFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsNotFound(true)
      return
    }

    const found = getProductById(id)
    if (!found) {
      setIsNotFound(true)
      return
    }

    setProduct(found)
    setFormData({
      name: found.name,
      sku: found.sku,
      category: found.category,
      price: String(found.price),
      stock: String(found.stock),
      image: found.image || "",
      status: found.status,
    })
    setIsNotFound(false)
  }, [id])

  const handleFieldChange = <K extends keyof ProductEditFormState>(
    field: K,
    value: ProductEditFormState[K]
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
    const newErrors: Partial<Record<keyof ProductEditFormState, string>> = {}

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
    if (!id || !validate()) return

    setIsSubmitting(true)

    updateProductInStore(id, {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      image: formData.image.trim(),
      status: formData.status,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/product")
    }, 250)
  }

  const handleDelete = () => {
    if (!id) return
    setIsDeleting(true)
    deleteProductFromStore(id)
    setTimeout(() => {
      setIsDeleting(false)
      navigate("/dashboard/product")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/product")
  }

  return {
    id,
    product,
    isNotFound,
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
