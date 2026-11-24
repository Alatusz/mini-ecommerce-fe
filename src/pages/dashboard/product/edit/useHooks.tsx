import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { QUERY_KEYS } from "@/lib/constants"
import { useCategoryOptions } from "../useHooks"
import {
  getProductById,
  updateProduct,
  deleteProduct,
  type IProduct,
  type ProductItem,
} from "@/services/product.services"
import { uploadImage } from "@/services/upload.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import {
  productFormSchema,
  type ProductFormState,
} from "../create/useHooks"

export type ProductEditFormState = ProductFormState

export function useProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: categoryOptions = [], isLoading: isLoadingCategories } =
    useCategoryOptions(100)

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlInput, setUseUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductEditFormState>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      price: "",
      stock: "0",
      image: "",
      description: "",
      status: "published",
    },
  })

  const image = form.watch("image")

  useEffect(() => {
    if (!productData) return
    form.reset({
      name: productData.name || "",
      sku: productData.sku || "",
      categoryId: productData.categories?.[0]?.id || "",
      price: String(productData.sellPrice ?? productData.originalPrice ?? 0),
      stock: String(productData.stock ?? 0),
      image: productData.images?.[0] || "",
      description: productData.description || "",
      status: productData.status || "published",
    })
  }, [productData, form])

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

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

    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image)
    }

    setSelectedFile(file)
    const localBlobUrl = URL.createObjectURL(file)
    form.setValue("image", localBlobUrl)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = () => {
    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image)
    }
    setSelectedFile(null)
    form.setValue("image", "")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!id) return

    try {
      let finalImageUrl = values.image || ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadImage(selectedFile)
        finalImageUrl = uploadRes.url
      }

      const priceNum = Number(values.price) || 0
      const stockNum = Number(values.stock) || 0

      updateProductMutation.mutate({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        slug: values.sku.trim().toLowerCase(),
        sellPrice: priceNum,
        originalPrice: priceNum,
        stock: stockNum,
        images: finalImageUrl ? [finalImageUrl] : [],
        status: values.status,
        categoryId: values.categoryId,
      })
    } catch (error) {
      console.error("Upload error:", error)
      showToast.error("Failed to upload image before saving")
    } finally {
      setIsUploading(false)
    }
  })

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
    control: form.control,
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
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
