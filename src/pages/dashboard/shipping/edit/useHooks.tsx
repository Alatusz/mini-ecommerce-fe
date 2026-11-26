import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import {
  useAdminShippingRatesQuery,
  useUpdateShippingRateMutation,
} from "../useHubs"
import {
  DEFAULT_SHIPPING_RATE_VALUES,
  shippingRateSchema,
  type ShippingRateFormValues,
} from "../schema"

export function useShippingEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useAdminShippingRatesQuery()
  const rate = data?.data?.find((item) => item.id === id)
  const isNotFound = !isLoading && !rate

  const { control, handleSubmit, reset } = useForm<ShippingRateFormValues>({
    resolver: zodResolver(shippingRateSchema),
    defaultValues: DEFAULT_SHIPPING_RATE_VALUES,
  })

  useEffect(() => {
    if (!rate) return
    reset({
      name: rate.name,
      price: Number(rate.price),
      freeMinSpend:
        rate.freeMinSpend !== null && rate.freeMinSpend !== undefined
          ? Number(rate.freeMinSpend)
          : null,
      minDays: Number(rate.minDays),
      maxDays: Number(rate.maxDays),
      sortOrder: Number(rate.sortOrder),
      isActive: rate.isActive,
    })
  }, [rate, reset])

  const updateMutation = useUpdateShippingRateMutation(() => {
    navigate("/dashboard/shipping")
  })

  const onSubmit = handleSubmit((values) => {
    if (!id) return
    updateMutation.mutate({
      id,
      payload: {
        name: values.name.trim(),
        price: values.price,
        freeMinSpend: values.freeMinSpend,
        minDays: values.minDays,
        maxDays: values.maxDays,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
      },
    })
  })

  const handleCancel = () => navigate("/dashboard/shipping")

  return {
    id,
    rate,
    isLoading,
    isNotFound,
    control,
    isSubmitting: updateMutation.isPending,
    handleSubmit: onSubmit,
    handleCancel,
  }
}
