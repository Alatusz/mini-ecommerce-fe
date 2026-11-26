import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { QUERY_KEYS } from "@/lib/constants"
import { useCategoryOptions } from "../useHooks"
import {
  createProduct,
  type IProduct,
} from "@/services/product.services"
import { uploadImage } from "@/services/upload.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z
    .string()
    .trim()
    .refine(
      (v) => v !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0,
      "Valid price is required"
    ),
  stock: z
    .string()
    .trim()
    .refine(
      (v) => v !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0,
      "Valid stock is required"
    ),
  image: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "archived"]),
})

export type ProductFormState = z.infer<typeof productFormSchema>

const toAutoSku = (name: string) =>
  name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .slice(0, 3)
    .join("-")

export function useProductCreate() {
  const navigate = useNavigate()

  const { data: categoryOptions = [], isLoading: isLoadingCategories } =
    useCategoryOptions(100)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrlInput, setUseUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductFormState>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      price: "",
      stock: "50",
      image: "",
      description: "",
      status: "published",
    },
  })

  const image = form.watch("image")
  const categoryId = form.watch("categoryId")

  useEffect(() => {
    if (!categoryId && categoryOptions.length > 0) {
      form.setValue("categoryId", categoryOptions[0].id)
    }
  }, [categoryOptions, categoryId, form])

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  const handleNameChange = (name: string) => {
    const prevName = form.getValues("name")
    const prevSku = form.getValues("sku")
    const prevAuto = toAutoSku(prevName)
    const suggestedSku = toAutoSku(name)

    form.setValue("name", name, { shouldValidate: true })
    if ((!prevSku || prevSku === prevAuto) && suggestedSku) {
      form.setValue("sku", suggestedSku, { shouldValidate: true })
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

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      let finalImageUrl = values.image || ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadImage(selectedFile)
        finalImageUrl = uploadRes.url
      }

      const priceNum = Number(values.price) || 0
      const stockNum = Number(values.stock) || 0

      createProductMutation.mutate({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        slug: values.sku.trim().toLowerCase(),
        sellPrice: priceNum,
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

  const handleCancel = () => {
    navigate("/dashboard/product")
  }

  return {
    control: form.control,
    categoryOptions,
    isLoadingCategories,
    isSubmitting: isUploading || createProductMutation.isPending,
    selectedFile,
    useUrlInput,
    toggleUseUrlInput: () => setUseUrlInput((prev) => !prev),
    fileInputRef,
    openFileDialog: () => fileInputRef.current?.click(),
    handleFileSelect,
    handleRemoveImage,
    handleNameChange,
    handleSubmit,
    handleCancel,
  }
}
