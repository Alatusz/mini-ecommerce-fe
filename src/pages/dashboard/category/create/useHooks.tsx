import { useEffect, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import type { z } from "zod"

import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { createCategory } from "@/services/category.services"
import { uploadImage } from "@/services/upload.services"
import {
  categoryCreateSchema,
  type CategoryCreateFormValues,
} from "../common/Category.shema"

export function useCategoryCreate() {
  const navigate = useNavigate()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlInput, setUseUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { control, handleSubmit, watch } = useForm<
    z.input<typeof categoryCreateSchema>,
    CategoryCreateFormValues
  >({
    defaultValues: {
      name: "",
      image: "",
      status: "active",
    },
    mode: "onChange",
    resolver: zodResolver(categoryCreateSchema),
  })

  const currentImage = watch("image")

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (currentImage?.startsWith("blob:")) {
        URL.revokeObjectURL(currentImage)
      }
    }
  }, [currentImage])

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: string) => void
  ) => {
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

    if (currentImage?.startsWith("blob:")) {
      URL.revokeObjectURL(currentImage)
    }

    setSelectedFile(file)
    const localBlobUrl = URL.createObjectURL(file)
    onChange(localBlobUrl)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = (
    onChange: (val: string) => void,
    currentValue: string
  ) => {
    if (currentValue?.startsWith("blob:")) {
      URL.revokeObjectURL(currentValue)
    }
    setSelectedFile(null)
    onChange("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      showToast.success("Category created successfully")

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.CATEGORIES_LIST],
      })

      navigate("/dashboard/category")
    },
    onError: (err) => {
      console.error("Failed to create category:", err)
      showToast.error("Failed to create category")
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      let finalImageUrl = data.image || ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadImage(selectedFile)
        finalImageUrl = uploadRes.url
      }
      createCategoryMutation.mutate({
        ...data,
        image: finalImageUrl,
      })
    } catch (error) {
      console.error("Upload error:", error)
      showToast.error("Failed to upload image before saving")
    } finally {
      setIsUploading(false)
    }
  })

  return {
    control,
    handleSubmit: onSubmit,
    createCategoryMutation,
    isError: createCategoryMutation.isError,

    // File / Attachment
    selectedFile,
    isSubmitting: isUploading || createCategoryMutation.isPending,
    useUrlInput,
    setUseUrlInput,
    toggleUseUrlInput: () => setUseUrlInput((prev) => !prev),
    fileInputRef,
    openFileDialog: () => fileInputRef.current?.click(),
    handleFileSelect,
    handleRemoveImage,
  }
}
