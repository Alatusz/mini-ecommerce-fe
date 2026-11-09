import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import type { z } from "zod"

import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { createCategory } from "@/services/category.services"
import {
  categoryCreateSchema,
  type CategoryCreateFormValues,
} from "../common/Category.shema"

export function useCategoryCreate() {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<
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

  const onSubmit = handleSubmit((data) => {
    createCategoryMutation.mutate(data)
  })

  return {
    control,
    handleSubmit: onSubmit,
    createCategoryMutation,
  }
}
