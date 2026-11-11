import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { getCategoryOptions } from "@/services/category.services"
import {
  getProductById,
  updateProduct,
  deleteProduct,
  type IProduct,
  type ProductPublishStatus,
  type ProductItem,
} from "@/services/product.services"
import { uploadImage } from "@/services/upload.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export interface ProductEditFormState {
  name: string
  sku: string
  categoryId: string
  price: string
  stock: string
  image: string
  status: ProductPublishStatus
}

export function useProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ── 1. ดึงตัวเลือกหมวดหมู่ผ่าน API ({feature}Options) ──
  const { data: categoryOptions = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEYS.OPTIONS.CATEGORIES],
    queryFn: getCategoryOptions,
    staleTime: 1000 * 60 * 5,
  })

  // ── 2. ดึงข้อมูลสินค้าที่ต้องการแก้ไขจาก Backend ──
  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.PRODUCTS_LIST, id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
    select: (res) => res.data as ProductItem,
  })

  // ── 3. Image Upload & Attachment State (อ้างอิง Category) ──
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlInput, setUseUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ProductEditFormState>({
    name: "",
    sku: "",
    categoryId: "",
    price: "",
    stock: "0",
    image: "",
    status: "published",
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductEditFormState, string>>
  >({})

  // Populate form data เมื่อ productData โหลดเสร็จ
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        sku: productData.sku || "",
        categoryId: productData.categories?.[0]?.id || "",
        price: String(productData.sellPrice ?? productData.originalPrice ?? 0),
        stock: String(productData.stock ?? 0),
        image: productData.images?.[0] || "",
        status: productData.status || "published",
      })
    }
  }, [productData])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (formData.image?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.image)
      }
    }
  }, [formData.image])

  const handleFieldChange = <K extends keyof ProductEditFormState>(
    field: K,
    value: ProductEditFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showToast.error("Only image files are allowed")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast.error("File size exceeds 5MB limit")
      return
    }

    if (formData.image?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image)
    }

    setSelectedFile(file)
    const localBlobUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, image: localBlobUrl }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = () => {
    if (formData.image?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image)
    }
    setSelectedFile(null)
    setFormData((prev) => ({ ...prev, image: "" }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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

    const priceNum = Number(formData.price)
    if (!formData.price.trim() || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Valid price is required"
    }

    const stockNum = Number(formData.stock)
    if (!formData.stock.trim() || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Valid stock count is required"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── 4. Mutation สำหรับ Update และ Delete ──
  const updateProductMutation = useMutation({
    mutationFn: (payload: Partial<IProduct>) => updateProduct(id!, payload),
    onSuccess: () => {
      showToast.success("Product updated successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.PRODUCTS_LIST],
      })
      navigate("/dashboard/product")
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to update product"
      showToast.error(message)
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(id!),
    onSuccess: () => {
      showToast.success("Product deleted successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.PRODUCTS_LIST],
      })
      navigate("/dashboard/product")
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to delete product"
      showToast.error(message)
    },
  })

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!id || !validate()) return

    try {
      let finalImageUrl = formData.image || ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadImage(selectedFile)
        finalImageUrl = uploadRes.url
      }

      const priceNum = Number(formData.price) || 0
      const stockNum = Number(formData.stock) || 0

      updateProductMutation.mutate({
        name: formData.name.trim(),
        slug: formData.sku.trim().toLowerCase(),
        sellPrice: priceNum,
        originalPrice: priceNum,
        stock: stockNum,
        images: finalImageUrl ? [finalImageUrl] : [],
        status: formData.status,
        categoryId: formData.categoryId,
      })
    } catch (error) {
      console.error("Upload error:", error)
      showToast.error("Failed to upload image before saving")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = () => {
    if (!id) return
    deleteProductMutation.mutate()
  }

  const handleCancel = () => {
    navigate("/dashboard/product")
  }

  return {
    id,
    product: productData,
    isNotFound: !isLoadingProduct && (isError || !productData),
    isLoading: isLoadingProduct,
    formData,
    errors,
    categoryOptions,
    isLoadingCategories,
    isSubmitting: isUploading || updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    selectedFile,
    useUrlInput,
    toggleUseUrlInput: () => setUseUrlInput((prev) => !prev),
    fileInputRef,
    openFileDialog: () => fileInputRef.current?.click(),
    handleFileSelect,
    handleRemoveImage,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
