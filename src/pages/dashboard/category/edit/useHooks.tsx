import axios from "axios"
import { useEffect } from "react"
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
import {
  categoryEditSchema,
  categoryStatusSchema,
  type CategoryEditFormValues,
} from "../common/Category.shema"

interface CategoryDetails extends Omit<CategoryEditFormValues, "image"> {
  id: string
  slug?: string
  productCount?: number
  itemCount?: number
  image?: string | null
}

export function useCategoryEdit() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()
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

    const status = categoryStatusSchema.safeParse(
      categoryQuery.data.status?.toLowerCase()
    )

    reset({
      name: categoryQuery.data.name,
      image: categoryQuery.data.image ?? "",
      status: status.success ? status.data : "active",
    })
  }, [categoryQuery.data, reset])

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

  const handleSubmit = submitForm((data) => {
    if (!id) {
      return
    }

    updateCategoryMutation.mutate({ categoryId: id, data })
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
    register,
    watch,
    setValue,
    errors,
    isSubmitting: updateCategoryMutation.isPending,
    handleSubmit,
    handleCancel: () => navigate("/dashboard/category"),
  }
}
