import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import type { z } from "zod"

import { showToast } from "@/lib/toast"
import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import {
  getCategoryById,
  updateCategory,
  type CategoryPayload,
} from "@/services/category.services"
import { uploadImage } from "@/services/upload.services"
import {
  categoryEditSchema,
  categoryStatusSchema,
  type CategoryEditFormValues,
} from "../common/Category.shema"

interface CategoryDetails extends Omit<CategoryEditFormValues, "image"> {
  id: string
  slug?: string
  productCount?: number
  image?: string | null
}

export function useCategoryEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Upload & File attachment state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlInput, setUseUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm<
    z.input<typeof categoryEditSchema>,
    unknown,
    CategoryEditFormValues
  >({
    defaultValues: {
      name: "",
      image: "",
      status: "active",
    },
    resolver: zodResolver(categoryEditSchema),
    mode: "onChange",
  })

  const image = watch("image")
  const status = watch("status")

  const categoryQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST, "detail", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Category ID is required")
      }

      const response = await getCategoryById(id)
      return (response?.data ?? response) as CategoryDetails
    },
    enabled: Boolean(id),
  })

  useEffect(() => {
    if (!categoryQuery.data) {
      return
    }

    const parsedStatus = categoryStatusSchema.safeParse(
      categoryQuery.data.status?.toLowerCase()
    )

    reset({
      name: categoryQuery.data.name,
      image: categoryQuery.data.image ?? "",
      status: parsedStatus.success ? parsedStatus.data : "active",
    })
  }, [categoryQuery.data, reset])

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  const productCount = categoryQuery.data?.productCount ?? 0
  const hasProducts = productCount > 0

  // File selection & validation
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
    setValue("image", localBlobUrl, { shouldDirty: true })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove image
  const handleRemoveImage = () => {
    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image)
    }
    setSelectedFile(null)
    setValue("image", "", { shouldDirty: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Change category status with product check
  const handleStatusChange = (newStatus: "active" | "archived" | "draft") => {
    if (hasProducts && newStatus !== "active") return
    setValue("status", newStatus, { shouldDirty: true })
  }

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string
      data: Partial<CategoryPayload>
    }) => updateCategory(categoryId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
      })
      showToast.success("Category updated successfully")
      navigate("/dashboard/category")
    },
    onError: showToast.error,
  })

  const handleSubmit = submitForm(async (data) => {
    if (!id) {
      return
    }

    try {
      let finalImageUrl = data.image || ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadImage(selectedFile)
        finalImageUrl = uploadRes.url
      }

      updateCategoryMutation.mutate({
        categoryId: id,
        data: {
          ...data,
          image: finalImageUrl,
        },
      })
    } catch (error) {
      console.error("Upload error:", error)
      showToast.error("Failed to upload image before saving")
    } finally {
      setIsUploading(false)
    }
  })

  const isNotFound =
    !id ||
    (categoryQuery.isSuccess && !categoryQuery.data) ||
    (axios.isAxiosError(categoryQuery.error) &&
      categoryQuery.error.response?.status === 404)

  return {
    id,
    category: categoryQuery.data,
    isLoading: categoryQuery.isLoading,
    isNotFound,
    loadError: categoryQuery.isError && !isNotFound,
    productCount,
    hasProducts,

    // Form fields & state
    register,
    image,
    status,
    errors,
    isSubmitting: isUploading || updateCategoryMutation.isPending,

    // File / Attachment
    selectedFile,
    useUrlInput,
    setUseUrlInput,
    toggleUseUrlInput: () => setUseUrlInput((prev) => !prev),
    fileInputRef,
    openFileDialog: () => fileInputRef.current?.click(),
    handleFileSelect,
    handleRemoveImage,

    // Status handler
    handleStatusChange,

    // Actions
    handleSubmit,
    handleCancel: () => navigate("/dashboard/category"),
  }
}
