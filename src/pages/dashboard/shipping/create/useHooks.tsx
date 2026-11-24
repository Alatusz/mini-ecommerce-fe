import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useCreateShippingRateMutation } from "../useHubs"
import {
  DEFAULT_SHIPPING_RATE_VALUES,
  shippingRateSchema,
  type ShippingRateFormValues,
} from "../schema"

export function useShippingCreate() {
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<ShippingRateFormValues>({
    resolver: zodResolver(shippingRateSchema),
    defaultValues: DEFAULT_SHIPPING_RATE_VALUES,
  })

  const createMutation = useCreateShippingRateMutation(() => {
    navigate("/dashboard/shipping")
  })

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate({
      name: values.name.trim(),
      price: values.price,
      freeMinSpend: values.freeMinSpend,
      minDays: values.minDays,
      maxDays: values.maxDays,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    })
  })

  const handleCancel = () => navigate("/dashboard/shipping")

  return {
    control,
    isSubmitting: createMutation.isPending,
    handleSubmit: onSubmit,
    handleCancel,
  }
}
