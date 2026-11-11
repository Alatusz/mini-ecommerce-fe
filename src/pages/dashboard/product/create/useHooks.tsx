import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { getCategoryOptions } from "@/services/category.services"
import {
  createProduct,
  type IProduct,
  type ProductPublishStatus,
} from "@/services/product.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export interface ProductFormState {
  name: string
  sku: string
  categoryId: string
  price: string
  stock: string
  image: string
  status: ProductPublishStatus
}

export function useProductCreate() {
  const navigate = useNavigate()

  // ── 1. ดึงตัวเลือกหมวดหมู่สำหรับใส่ Dropdown ({feature}Options Convention) ──
  const { data: categoryOptions = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEYS.OPTIONS.CATEGORIES],
    queryFn: getCategoryOptions,
    staleTime: 1000 * 60 * 5, // แคชไว้ 5 นาทีตาม Best Practice
  })

  const [formData, setFormData] = useState<ProductFormState>({
    name: "",
    sku: "",
    categoryId: "",
    price: "",
    stock: "50",
    image: "",
    status: "published",
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormState, string>>
  >({})

  // Auto-select first category เมื่อ options โหลดเสร็จ
  useEffect(() => {
    if (!formData.categoryId && categoryOptions.length > 0) {
      setFormData((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categoryOptions[0].id,
      }))
    }
  }, [categoryOptions, formData.categoryId])

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
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormState, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required"
    }

    const priceNum = Number(formData.price)
    if (!formData.price.trim() || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Valid price is required"
    }

    const stockNum = Number(formData.stock)
    if (!formData.stock.trim() || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Valid stock is required"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── 2. Mutation สำหรับสร้างสินค้าใหม่ผ่าน API ──
  const createProductMutation = useMutation({
    mutationFn: (payload: IProduct) => createProduct(payload),
    onSuccess: () => {
      showToast.success("Product created successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.PRODUCTS_LIST],
      })
      navigate("/dashboard/product")
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to create product"
      showToast.error(message)
    },
  })

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validate()) return

    const priceNum = Number(formData.price) || 0
    const stockNum = Number(formData.stock) || 0

    createProductMutation.mutate({
      name: formData.name.trim(),
      slug: formData.sku.trim().toLowerCase(),
      sellPrice: priceNum,
      originalPrice: priceNum,
      stock: stockNum,
      images: formData.image.trim() ? [formData.image.trim()] : [],
      status: formData.status,
      categoryId: formData.categoryId,
    })
  }

  const handleCancel = () => {
    navigate("/dashboard/product")
  }

  return {
    formData,
    errors,
    categoryOptions,
    isLoadingCategories,
    isSubmitting: createProductMutation.isPending,
    handleNameChange,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  }
}
